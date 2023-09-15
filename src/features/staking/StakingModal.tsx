import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { LineBreak } from "../common/LineBreak";
import { Modal } from "../common/Modal";
import { ManageStake } from "./ManageStake";
import { TransactionTracker } from "./TransactionTracker";
import { useApproveAst } from "./hooks/useApproveAst";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import { useStakingModalStore } from "./store/useStakingModalStore";
import {
  StakeOrUnstake,
  TransactionErrorLookup,
  TransactionHashLookup,
  TransactionStatusLookup,
} from "./types/StakingTypes";
import { buttonStatusText } from "./utils/buttonStatusText";
import { handleButtonActions } from "./utils/handleButtonActions";
import { transactionTrackerMessages } from "./utils/transactionTrackerMessages";

export const StakingModal = () => {
  const [
    showStakingModal,
    setShowStakingModal,
    stakeOrUnstake,
    setStakeOrUnstake,
    trackerStatus,
    setTrackerStatus,
  ] = useStakingModalStore((state) => [
    state.showStakingModal,
    state.setShowStakingModal,
    state.stakeOrUnstake,
    state.setStakeOrUnstake,
    state.trackerStatus,
    state.setTrackerStatus,
  ]);

  const formReturn = useForm();
  const { watch, setValue } = formReturn;
  const stakingAmount = watch("stakingAmount") || "0";

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();

  const {
    ustakableSAstBalanceFormatted: unstakableSastBalance,
    astBalanceFormatted: astBalance,
  } = useTokenBalances();

  const canUnstake = stakingAmount <= +unstakableSastBalance;

  const needsApproval =
    stakeOrUnstake === StakeOrUnstake.STAKE &&
    stakingAmount > 0 &&
    +astAllowance < +stakingAmount;

  const canStake =
    !needsApproval && +stakingAmount <= +astBalance && +stakingAmount > 0;

  const {
    approveAst,
    statusApproveAst,
    isErrorApproveAst,
    transactionReceiptApprove,
    resetApproveAst,
  } = useApproveAst({
    stakingAmount,
    enabled: needsApproval,
  });

  const {
    stakeAst,
    resetStakeAst,
    transactionReceiptStakeAst,
    statusStakeAst,
    isErrorStakeAst,
  } = useStakeAst({
    stakingAmount,
    enabled: canStake,
  });

  const {
    unstakeSast,
    resetUnstakeSast,
    statusUnstakeSast,
    transactionReceiptUnstakeSast,
    isErrorUnstakeSast,
  } = useUnstakeSast({
    unstakingAmount: stakingAmount,
    canUnstake,
  });

  const transactionStatusLookup: TransactionStatusLookup = {
    statusApproveAst,
    statusStakeAst,
    statusUnstakeSast,
  };

  const transactionHashLookup: TransactionHashLookup = {
    transactionReceiptApprove,
    transactionReceiptStakeAst,
    transactionReceiptUnstakeSast,
  };

  const transactionErrorLookup: TransactionErrorLookup = {
    isErrorApproveAst,
    isErrorStakeAst,
    isErrorUnstakeSast,
  };

  const buttonText = buttonStatusText({
    stakeOrUnstake,
    trackerStatus,
    needsApproval,
  });

  const isLoadingTransactions =
    statusApproveAst === "loading" ||
    statusStakeAst === "loading" ||
    statusUnstakeSast === "loading";

  // button disabled if input is empty, input amount exceeds balance, transaction is pending, or transaction is successful
  const isStakeButtonDisabled =
    stakingAmount <= 0 ||
    (stakeOrUnstake === StakeOrUnstake.STAKE && stakingAmount > astBalance) ||
    (stakeOrUnstake === StakeOrUnstake.UNSTAKE &&
      stakingAmount > unstakableSastBalance) ||
    isLoadingTransactions;

  const headline = transactionTrackerMessages[trackerStatus].headline;

  const relevantStatuses = ["loading", "error", "success"];
  const onlyShowTransactionTracker =
    relevantStatuses.includes(statusApproveAst) ||
    relevantStatuses.includes(statusStakeAst) ||
    relevantStatuses.includes(statusUnstakeSast);

  return (
    <>
      {showStakingModal && (
        <Modal
          className="w-full max-w-none xs:max-w-[360px]"
          onCloseRequest={() => setShowStakingModal(false)}
        >
          <div className="flex justify-between items-center mb-7 mt-1">
            <h2 className="font-semibold text-xl">{headline}</h2>
            <div
              className="hover:cursor-pointer"
              onClick={() => setShowStakingModal(false)}
            >
              <MdClose className="text-gray-500" size={26} />
            </div>
          </div>
          <LineBreak className="mb-4 -mx-6" />
          {!onlyShowTransactionTracker && (
            <ManageStake
              formReturn={formReturn}
              transactionStatusLookup={transactionStatusLookup}
            />
          )}

          <TransactionTracker
            stakingAmount={stakingAmount}
            transactionStatusLookup={transactionStatusLookup}
            transactionHashLookup={transactionHashLookup}
            transactionErrorLookup={transactionErrorLookup}
          />

          {/* TODO: border radius not rendering correctly. */}
          <Button
            className={twJoin(
              "mt-6 w-full !rounded-sm",
              `${isStakeButtonDisabled && "opacity-50"}`,
            )}
            color="primary"
            rounded={false}
            isDisabled={isStakeButtonDisabled}
            isHidden={isLoadingTransactions}
            onClick={() => {
              handleButtonActions({
                needsApproval,
                transactionStatusLookup,
                resetApproveAst,
                resetStakeAst,
                resetUnstakeSast,
                canUnstake,
                approveAst,
                stakeAst,
                unstakeSast,
                setValue,
              });
            }}
          >
            <span>{buttonText}</span>
          </Button>
        </Modal>
      )}
    </>
  );
};
