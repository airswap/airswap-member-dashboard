import { FC, RefObject, useEffect, useState } from "react";
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
// import { encodeFunctionData } from "viem";
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
  const { write: approveAst, data: dataApproveAst } =
    useContractWrite(configApprove);
  // check transaction status and hash
  const { data: hashApproveAst, status: statusApproveAst } =
    useWaitForTransaction({
      hash: dataApproveAst?.hash,
      onSettled() {
        // putting this logic into useEffect hook will never allow statusApproveAst to not equal "success"
        if (statusApproveAst === "success") {
          setStatusStaking("approved");
        }
      },
    });

  // start staking funtion
  const { config: configStake } = usePrepareContractWrite({
    address: contractAddresses[chainId].staking as `0x${string}`,
    abi: stakingABI,
    functionName: "stake",
    args: [stakingAmount * Math.pow(10, 4)],
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });
  const { write: writeStakeFunction, data: dataStakeFunction } =
    useContractWrite(configStake);
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

  const { data: astAllowanceData } = useContractRead({
    address: contractAddresses[chainId].ast as `0x${string}`,
    abi: astABI,
    functionName: "allowance",
    args: [address, contractAddresses[chainId].staking],
    watch: true,
    staleTime: 300_000, // 5 minutes,
  });

  // convert unformatted balances
  const astAllowance = (astAllowanceData as bigint).toString() || "0";
  const astBalance = format(astBalanceData?.value, {
    tokenDecimals: 4,
  }).replace("T", "");
  const sAstBalance = (sAstBalanceData as bigint).toString();

  const needsApproval = stakingAmount < +astAllowance;
  console.log(
    needsApproval ? "true, needs approval" : "false, go ahead and stake!",
  );

  const headline = modalHeadline(statusStaking);

  const doNotShowButtonLogic =
    statusStaking === "approving" ||
    statusStaking === "approved" ||
    statusStaking === "staking";

  const disableButtonLogic = (statusStaking: string) => {
    if (statusStaking === "unapproved") {
      return stakingAmount <= 0;
    } else if (statusStaking === "approved") {
      return +astBalance < +astAllowance;
    }
  };

  const buttonText = buttonStatusText(statusStaking);

  const buttonAction = () => {
    if (statusStaking === "unapproved") {
      return approveAst && approveAst();
    } else if (statusStaking === "readyToStake") {
      return writeStakeFunction && writeStakeFunction();
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
    if (statusApproveAst === "loading") {
      setStatusStaking("approving");
    } else if (statusStakeAst === "loading") {
      setStatusStaking("staking");
    }
    console.log("statusStaking", statusStaking);
  }, [statusApproveAst, statusStaking, statusStakeAst]);

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

      {statusStaking === "approving" ? (
        <PendingTransaction statusStaking={statusStaking} />
      ) : null}

      {statusStaking === "approved" || statusStaking === "staking" ? (
        <ApproveSuccess
          statusStaking={statusStaking}
          setStatusStaking={setStatusStaking}
          amountApproved={stakingAmount.toString()}
          chainId={chainId}
          transactionHashApprove={hashApproveAst?.transactionHash}
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

      {!doNotShowButtonLogic && (
        <Button
          className="mb-2 mt-10 w-full rounded-sm bg-accent-blue font-semibold uppercase"
          onClick={buttonAction}
          disabled={disableButtonLogic(statusStaking)}
        >
          {buttonText}
        </Button>
      )}
    </dialog>
  );
};

export default StakingModal;
