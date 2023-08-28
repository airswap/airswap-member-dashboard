import { FC, RefObject, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { astAbi } from "../../contracts/astAbi";
import { stakingAbi } from "../../contracts/stakingAbi";
import { Button } from "../common/Button";
import ApproveSuccess from "./subcomponents/ApproveSuccess";
import ManageStake from "./subcomponents/ManageStake";
import PendingTransaction from "./subcomponents/PendingTransaction";
import TransactionFailed from "./subcomponents/TransactionFailed";
import { StatusStaking } from "./types/StakingTypes";
import { buttonStatusText } from "./utils/buttonStatusText";
import { modalHeadline } from "./utils/headline";
import { useTokenBalances } from "../../hooks/useTokenBalances";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
  address: `0x${string}`;
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
    // formState: { errors },
  } = useForm<{ stakingAmount: number }>();
  const stakingAmount = watch("stakingAmount") || "0";

  const { astBalanceFormatted: astBalance } = useTokenBalances();

  const [AirSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });
  const [AirSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const { refetch: refetchAllowance } = useContractRead(
    {
      address: AirSwapToken.address,
      abi: astAbi,
      functionName: "allowance",
      args: [address, AirSwapStaking.address as `0x${string}`],
      watch: true,
      staleTime: 300_000, // 5 minutes,
    },
  );

  // Start approve functionse
  const { config: configApprove } = usePrepareContractWrite({
    address: AirSwapToken.address,
    abi: astAbi,
    functionName: "approve",
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    args: [
      AirSwapStaking.address as `0x${string}`,
      BigInt(+stakingAmount * Math.pow(10, 4)),
    ],
    enabled: !!stakingAmount,
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

  const needsApproval = +astBalance < +stakingAmount;

  const handleClickApprove = useCallback(async () => {
    if (approve) {
      const receipt = await approve();
      await receipt;
      refetchAllowance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approve]);

  // start staking funtion
  const { config: configStake } = usePrepareContractWrite({
    address: AirSwapStaking.address,
    abi: stakingAbi,
    functionName: "stake",
    args: [BigInt(+stakingAmount * Math.pow(10, 4))],
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    enabled: !needsApproval && +stakingAmount > 0,
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
        <ManageStake register={register} setValue={setValue} />
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
