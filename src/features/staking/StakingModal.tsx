import { FC, RefObject, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { ManageStake } from "./ManageStake";
import { TransactionTracker } from "./TransactionTracker";
import { useApproveAst } from "./hooks/useApproveAst";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import { StakeOrUnstake, TransactionState } from "./types/StakingTypes";
import { buttonStatusText } from "./utils/buttonStatusText";
import { handleButtonActions } from "./utils/handleButtonActions";
import { transactionTrackerMessages } from "./utils/transactionTrackerMessages";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
}

export const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
}) => {
  const [stakeOrUnstake, setStakeOrUnstake] = useState<StakeOrUnstake>(
    StakeOrUnstake.STAKE,
  );
  const [trackerStatus, setTrackerStatus] = useState<TransactionState>(
    TransactionState.Idle,
  );

  const formReturn = useForm();
  const { watch, setValue } = formReturn;
  const stakingAmount = watch("stakingAmount") || "0";

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();

  const {
    ustakableSAstBalanceFormatted: unstakableSAstBalance,
    astBalanceFormatted: astBalance,
  } = useTokenBalances();

  const canUnstake = stakingAmount <= +unstakableSAstBalance;

  const needsApproval =
    stakeOrUnstake === StakeOrUnstake.STAKE &&
    stakingAmount > 0 &&
    +astAllowance < +stakingAmount;

  const canStake =
    !needsApproval && +stakingAmount <= +astBalance && +stakingAmount > 0;

  const { approve, statusApprove, isErrorApprove, transactionReceiptApprove } =
    useApproveAst({
      stakingAmount,
      enabled: needsApproval,
    });

  const {
    stake,
    resetStake,
    transactionReceiptStake,
    statusStake,
    isErrorStake,
  } = useStakeAst({
    stakingAmount,
    enabled: canStake,
  });

  const {
    unstake,
    resetUnstake,
    statusUnstake,
    transactionReceiptUnstake,
    isErrorUnstake,
  } = useUnstakeSast({
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

  const loadingTransactions =
    statusApprove === "loading" ||
    statusStake === "loading" ||
    statusUnstake === "loading";

  // button disabled if input is empty, or any transaction is pending
  const isButtonDisabled =
    stakingAmount <= 0 ||
    (stakeOrUnstake === StakeOrUnstake.STAKE && stakingAmount > astBalance) ||
    (stakeOrUnstake === StakeOrUnstake.UNSTAKE &&
      stakingAmount > unstakableSAstBalance) ||
    loadingTransactions;

  const headline = transactionTrackerMessages[trackerStatus].headline;

  const relevantStatuses = ["loading", "error", "success"];
  const onlyShowTransactionTracker =
    relevantStatuses.includes(statusApprove) ||
    relevantStatuses.includes(statusStake) ||
    relevantStatuses.includes(statusUnstake);

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close();
    setValue("stakingAmount", 0);
  };

  // TODO: replace this with our `Modal` component so it inherits the close
  // to click etc.
  return (
    <dialog
      className={twJoin(
        "bg-gray-900 p-6 text-white",
        "w-full max-w-none xs:max-w-[360px]",
        "border border-gray-800 rounded-none xs:rounded-lg",
        "backdrop:bg-gray-950 backdrop:bg-opacity-[85%] backdrop:backdrop-blur-[2px]",
      )}
      ref={stakingModalRef}
    >
      <div className="flex justify-between items-center mb-7 mt-1">
        <h2 className="font-semibold text-xl">{headline}</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <MdClose className="text-gray-500" size={26} />
        </div>
      </div>
      <ManageStake
        displayManageStake={!onlyShowTransactionTracker}
        formReturn={formReturn}
        stakeOrUnstake={stakeOrUnstake}
        setStakeOrUnstake={setStakeOrUnstake}
        statusApprove={statusApprove}
        statusStake={statusStake}
        statusUnstake={statusUnstake}
      />

      <TransactionTracker
        stakeOrUnstake={stakeOrUnstake}
        trackerStatus={trackerStatus}
        setTrackerStatus={setTrackerStatus}
        stakingAmount={stakingAmount}
        statusApprove={statusApprove}
        statusStake={statusStake}
        statusUnstake={statusUnstake}
        isErrorApprove={isErrorApprove}
        isErrorStake={isErrorStake}
        isErrorUnstake={isErrorUnstake}
        transactionHashApprove={transactionReceiptApprove}
        transactionHashStake={transactionReceiptStake}
        transactionHashUnstake={transactionReceiptUnstake}
      />

      {/* TODO: border radius not rendering correctly. */}
      <Button
        className={twJoin(
          "mt-6 w-full !rounded-sm",
          `${isButtonDisabled && "opacity-50"}`,
        )}
        color="primary"
        rounded={false}
        isDisabled={isButtonDisabled}
        onClick={() => {
          handleButtonActions({
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
      >
        <span>{buttonText}</span>
      </Button>
    </dialog>
  );
};
