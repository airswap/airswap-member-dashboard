import { FC, RefObject, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { useApproveToken } from "./hooks/useApproveToken";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import ApproveSuccess from "./subcomponents/ApproveSuccess";
import ManageStake from "./subcomponents/ManageStake";
import { StakeOrUnstake, StakingStatus } from "./types/StakingTypes";
import { handleStatusStaking } from "./utils/handleStatusStaking";
import {
  buttonLoadingSpinner,
  buttonStatusText,
  handleButtonActions,
  modalHeadline,
} from "./utils/helpers";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
  chainId: number;
}

const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
  chainId,
}) => {
  const [statusStaking, setStatusStaking] = useState<StakingStatus>(
    StakingStatus.UNAPPROVED,
  );
  const [stakeOrUnstake, setStakeOrUnstake] = useState<StakeOrUnstake>(
    StakeOrUnstake.STAKE,
  );

  const {
    register,
    watch,
    setValue,
    // formState: { errors },
  } = useForm<{ stakingAmount: number }>();
  const stakingAmount = watch("stakingAmount") || 0;

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();
  const {
    // sAstBalanceFormatted,
    ustakableSAstBalanceFormatted,
  } = useTokenBalances();

  const needsApproval =
    stakeOrUnstake === StakeOrUnstake.STAKE && stakingAmount > 0
      ? Number(astAllowance) < stakingAmount
      : false;

  const canUnstake =
    stakeOrUnstake === StakeOrUnstake.UNSTAKE && stakingAmount > 0
      ? stakingAmount <= Number(ustakableSAstBalanceFormatted)
      : false;

  const {
    approve,
    // resetApprove,
    transactionReceiptApprove,
    statusApprove,
  } = useApproveToken({
    stakingAmount,
    needsApproval,
    setStatusStaking,
  });

  const { stake, resetStake, transactionReceiptStake, statusStake } =
    useStakeAst({
      stakingAmount,
      needsApproval,
      setStatusStaking,
    });

  const { unstake, resetUnstake, statusUnstake, transactionReceiptUnstake } =
    useUnstakeSast({
      unstakingAmount: stakingAmount,
      canUnstake,
    });

  const buttonText = buttonStatusText({
    stakeOrUnstake,
    needsApproval,
    statusApprove,
    statusStake,
    statusUnstake,
  });

  const isLoadingSpinner = buttonLoadingSpinner({
    stakeOrUnstake,
    needsApproval,
    statusApprove,
    statusStake,
    statusUnstake,
  });

  const isButtonDisabled = stakingAmount <= 0;

  const headline = modalHeadline(statusStaking);

  const renderManageStake = () => {
    if (statusStake === "success") {
      return false;
    } else if (statusUnstake === "success") {
      return false;
    } else {
      return true;
    }
  };
  const isRenderManageStake = renderManageStake();

  const isRenderApproveSuccess =
    statusStake === "success" || statusUnstake === "success";

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close();
    setValue("stakingAmount", 0);
  };

  console.log(
    "statusStake:",
    statusStake,
    "\n",
    "statusApprove:",
    statusApprove,
    "\n",
    "needsApproval:",
    needsApproval,
    "\n",
    "canUnstake:",
    canUnstake,
    "\n",
    "statusUnstake:",
    statusUnstake,
  );

  useEffect(() => {
    handleStatusStaking({
      needsApproval,
      statusApprove,
      setStatusStaking,
      statusStake,
      stakeHash: transactionReceiptStake?.transactionHash,
    });
  }, [
    stakeOrUnstake,
    needsApproval,
    statusApprove,
    statusStake,
    transactionReceiptStake,
    setStatusStaking,
  ]);

  return (
    <dialog
      className={twJoin([
        "content-center border border-border-darkGray bg-black p-6 text-white",
        "w-fit xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3",
      ])}
      ref={stakingModalRef}
    >
      <div className="flex justify-between">
        <h2 className="font-semibold">{headline}</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      {isRenderManageStake ? (
        <ManageStake
          register={register}
          setValue={setValue}
          stakeOrUnstake={stakeOrUnstake}
          setStakeOrUnstake={setStakeOrUnstake}
        />
      ) : null}

      {/* {isRenderPendingTransaction ? (
        <PendingTransaction
          statusStaking={statusStaking}
          statusUnstake={statusUnstake}
        />
      ) : null} */}

      {isRenderApproveSuccess ? (
        <ApproveSuccess
          stakeOrUnstake={stakeOrUnstake}
          statusStaking={statusStaking}
          statusUnstake={statusUnstake}
          amount={stakingAmount.toString()}
          chainId={chainId}
          transactionHashApprove={transactionReceiptApprove?.transactionHash}
          transactionHashStake={transactionReceiptStake?.transactionHash}
          transactionHashUnstake={transactionReceiptUnstake?.transactionHash}
        />
      ) : null}

      {/* {shouldRenderTransactionFailed ? (
        <TransactionFailed
          chainId={chainId}
          transactionHashApprove={transactionReceiptUnstake?.transactionHash}
          transactionHashStake={transactionReceiptApprove?.transactionHash}
          transactionHashUnstake={transactionReceiptApprove?.transactionHash}
        />
      ) : null} */}

      <Button
        className={twJoin([
          "flex flex-row items-center mb-2 mt-10 w-full rounded-sm bg-accent-blue font-semibold uppercase justify-center",
          `${isButtonDisabled && "opacity-50"}`,
        ])}
        onClick={() => {
          handleButtonActions({
            stakeOrUnstake,
            needsApproval,
            statusStake,
            statusUnstake,
            resetStake,
            resetUnstake,
            canUnstake,
            approve,
            stake,
            unstake,
            setValue,
          });
        }}
        disabled={isButtonDisabled}
      >
        {isLoadingSpinner && <ImSpinner8 className="animate-spin mr-2 " />}
        <span>{buttonText}</span>
      </Button>
    </dialog>
  );
};

export default StakingModal;
