import { useWaitForTransaction } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { ManageStake } from "./ManageStake";
import { TransactionTracker } from "./TransactionTracker";
import { useApproveAst } from "./hooks/useApproveAst";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import { TxType, useStakingModalStore } from "./store/useStakingModalStore";
import { AmountStakedText } from "./subcomponents/AmountStakedText";
import { actionButtonsObject } from "./utils/actionButtonsObject";
import { modalButtonActionsAndText } from "./utils/modalButtonActionsAndText";
import { transactionTrackerMessages } from "./utils/transactionTrackerMessages";

export const StakingModal = () => {
  const { formReturn, setShowStakingModal, txType } = useStakingModalStore();

  const { watch } = formReturn;
  const stakingAmount = watch("stakingAmount") || "0";

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();

  const {
    ustakableSAstBalanceFormatted: unstakableSastBalance,
    astBalanceFormatted: astBalance,
  } = useTokenBalances();

  const needsApproval =
    txType === TxType.STAKE &&
    parseFloat(stakingAmount) > 0 &&
    parseFloat(astAllowance) < parseFloat(stakingAmount);

  const canUnstake = stakingAmount <= +unstakableSastBalance;
  const canStake =
    !needsApproval && +stakingAmount <= +astBalance && +stakingAmount > 0;

  const { approveAst, dataApproveAst, resetApproveAst } = useApproveAst({
    stakingAmount,
    enabled: needsApproval,
  });

  const { stakeAst, resetStakeAst, dataStakeAst } = useStakeAst({
    stakingAmount,
    enabled: canStake,
  });

  const { unstakeSast, resetUnstakeSast, dataUnstakeSast } = useUnstakeSast({
    unstakingAmount: stakingAmount,
    canUnstake,
  });

  const transactionHashes =
    dataApproveAst?.hash || dataStakeAst?.hash || dataUnstakeSast?.hash;

  const { status: txStatus } = useWaitForTransaction({
    hash: transactionHashes,
    enabled: !!transactionHashes,
  });

  // These are "action" buttons for transactions. The `actionButtons` var below gets passed into TransactionTracker.tsx and rendered there
  const modalButtonAction = modalButtonActionsAndText({
    txType,
    needsApproval,
    buttonActions: {
      approve: approveAst,
      stake: stakeAst,
      unstake: unstakeSast,
    },
  });

  const isAmountInvalid = +stakingAmount <= 0;
  const insufficientAstBalance =
    txType === TxType.STAKE && stakingAmount > astBalance;
  const insufficientSastBalance =
    txType === TxType.UNSTAKE && stakingAmount > unstakableSastBalance;

  const isStakeButtonDisabled =
    isAmountInvalid || insufficientAstBalance || insufficientSastBalance;

  const successText = (
    <AmountStakedText stakingAmount={stakingAmount} txStatus={txStatus} />
  );
  const actionDescription = transactionTrackerMessages({
    txStatus,
    dataApproveAst,
    dataStakeAst,
    dataUnstakeSast,
  });

  const actionButtons = actionButtonsObject({
    resetApproveAst,
    resetStakeAst,
    resetUnstakeSast,
  });

  const actionButtonLogic = () => {
    if (dataApproveAst) {
      return actionButtons.approve;
    } else if (dataStakeAst) {
      return actionButtons.stake;
    } else if (dataUnstakeSast) {
      return actionButtons.unstake;
    } else {
      return undefined;
    }
  };

  return (
    <Modal
      className="w-full max-w-none xs:max-w-[360px] text-white"
      modalHeadline={"Manage stake"}
      onCloseRequest={() => setShowStakingModal(false)}
    >
      {transactionHashes ? (
        <TransactionTracker
          actionDescription={actionDescription}
          successText={successText}
          actionButtons={actionButtonLogic()}
          txHash={transactionHashes}
        />
      ) : (
        <>
          <ManageStake />
          <div>
            <Button
              onClick={modalButtonAction?.callback}
              isDisabled={isStakeButtonDisabled}
              color="primary"
              rounded={false}
              className="w-full mt-10"
            >
              {modalButtonAction?.label}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
