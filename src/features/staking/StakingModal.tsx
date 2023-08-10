import { FC, RefObject, useCallback, useEffect, useState } from "react";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useBalance,
  useWaitForTransaction,
} from "wagmi";
import { contractAddresses } from "../../utils/constants";
import stakingABI from "../../contracts/stakingAbi.json";
import astABI from "../../contracts/astAbi.json";
import { buttonStatusText } from "./uils/buttonStatusText";
import { useForm } from "react-hook-form";
import { format } from "@greypixel_/nicenumbers";
import ManageStake from "./subcomponents/ManageStake";
import { StakeInput, StatusStaking } from "./types/StakingTypes";
import PendingTransaction from "./subcomponents/PendingTransaction";
import ApproveSuccess from "./subcomponents/ApproveSuccess";
import { VscChromeClose } from "react-icons/vsc";
import { modalHeadline } from "./uils/headline";
import TransactionFailed from "./subcomponents/TransactionFailed";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
  address: string;
  chainId: number;
}

const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
  address,
  chainId,
}) => {
  const [statusStaking, setStatusStaking] =
    useState<StatusStaking>("unapproved");

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<StakeInput>();

  watch();
  const values = getValues();
  const stakingAmount = values.stakingAmount || 0;

  const { data: astBalanceData } = useBalance({
    address: address as `0x${string}`,
    token: (contractAddresses[chainId].ast as `0x${string}`) || "",
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });

  const { data: sAstBalanceData } = useContractRead({
    address: contractAddresses[chainId].staking as `0x${string}`,
    abi: stakingABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
    staleTime: 300_000, // 5 minutes,
  });

  // Start approve functions
  const { config: configApprove } = usePrepareContractWrite({
    address: contractAddresses[chainId].ast as `0x${string}`,
    abi: astABI,
    functionName: "approve",
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    args: [contractAddresses[chainId].staking, stakingAmount * Math.pow(10, 4)],
  });
  const { writeAsync: approve, data: dataApprove } =
    useContractWrite(configApprove);

  // TODO: code below can probably be refactored
  // check transaction status and hash
  const { data: hashApprove, status: statusApprove } = useWaitForTransaction({
    hash: dataApprove?.hash,
    onSettled() {
      // putting this logic into useEffect hook will never allow statusApprove to not equal "success"
      if (statusApprove === "success") {
        setStatusStaking("approved");
      }
    },
  });

  const handleClickApprove = useCallback(async () => {
    if (approve) {
      const receipt = await approve();
      // await receipt.wait(2);
      await receipt;
      refetchAllowance();
    }
  }, [approve]);

  // start staking funtion
  const { config: configStake } = usePrepareContractWrite({
    address: contractAddresses[chainId].staking as `0x${string}`,
    abi: stakingABI,
    functionName: "stake",
    args: [stakingAmount * Math.pow(10, 4)],
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });

  const { writeAsync: stake, data: dataStakeFunction } =
    useContractWrite(configStake);

  // TODO: code below can probably be refactored
  // check transaction status and hash
  const { data: hashStake, status: statusStakeAst } = useWaitForTransaction({
    hash: dataStakeFunction?.hash,
    onSettled() {
      if (statusStakeAst === "success") {
        setStatusStaking("success");
      }
    },
    onError(err) {
      console.log("Error", err);
      setStatusStaking("failed");
    },
  });

  const handleClickStake = useCallback(async () => {
    if (stake) {
      const receipt = await stake();
      await receipt;
      await console.log(receipt);
    }
  }, [stake]);

  const { data: astAllowanceData, refetch: refetchAllowance } = useContractRead(
    {
      address: contractAddresses[chainId].ast as `0x${string}`,
      abi: astABI,
      functionName: "allowance",
      args: [address, contractAddresses[chainId].staking],
      watch: true,
      staleTime: 300_000, // 5 minutes,
    },
  );

  // convert unformatted balances
  const astAllowance = format(astAllowanceData, { tokenDecimals: 4 });
  const astBalance = format(astBalanceData?.value, { tokenDecimals: 4 });
  const sAstBalance = format(sAstBalanceData, { tokenDecimals: 4 });

  const needsApproval = +astBalance < +stakingAmount;
  console.log(typeof needsApproval, needsApproval);

  const headline = modalHeadline(statusStaking);

  // button should not render on certain components
  const shouldRenderBtn = () => {
    if (
      statusStaking === "approving" ||
      statusStaking === "approved" ||
      statusStaking === "staking"
    ) {
      return true;
    }
  };
  const isShouldRenderBtn = shouldRenderBtn();

  const buttonText = buttonStatusText(statusStaking);

  const buttonAction = () => {
    if (statusStaking === "unapproved") {
      return approve && handleClickApprove();
    } else if (statusStaking === "readyToStake") {
      return stake && handleClickStake();
    } else if (statusStaking === "success") {
      setStatusStaking("unapproved");
    }
  };

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close();
    setValue("stakingAmount", 0);
  };

  useEffect(() => {
    // putting this into `onSettled` in `useWaitForTransaction` will cause too much lag
    if (statusApprove === "loading") {
      setStatusStaking("approving");
    }

    if (statusStakeAst === "loading") {
      setStatusStaking("staking");
    }
    console.log("statusStaking", statusStaking);
  }, [stakingAmount, statusApprove, statusStaking, statusStakeAst]);

  return (
    <dialog
      className={twJoin(
        "content-center border border-border-darkGray bg-black p-6 text-white",
        ["w-fit xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/5"],
      )}
      ref={stakingModalRef}
    >
      <div className="flex justify-between">
        <h2 className="font-semibold">{headline}</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      {statusStaking === "unapproved" || statusStaking === "readyToStake" ? (
        <ManageStake
          sAstBalance={sAstBalance}
          astBalance={astBalance}
          register={register}
          setValue={setValue}
        />
      ) : null}

      {statusStaking === "approving" || statusStaking === "staking" ? (
        <PendingTransaction statusStaking={statusStaking} />
      ) : null}

      {statusStaking === "approved" || statusStaking === "success" ? (
        <ApproveSuccess
          statusStaking={statusStaking}
          setStatusStaking={setStatusStaking}
          amountApproved={stakingAmount.toString()}
          amountStaked={stakingAmount.toString()}
          chainId={chainId}
          transactionHashApprove={hashApprove?.transactionHash}
          transactionHashStake={hashStake?.transactionHash}
        />
      ) : null}

      {statusStaking === "failed" ? (
        <TransactionFailed
          setStatusStaking={setStatusStaking}
          chainId={chainId}
          transactionHash="0x"
        />
      ) : null}

      {!isShouldRenderBtn && (
        <Button
          className="mb-2 mt-10 w-full rounded-sm bg-accent-blue font-semibold uppercase"
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      )}
    </dialog>
  );
};

export default StakingModal;
