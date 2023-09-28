import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWaitForTransaction } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { TransactionTracker } from "../common/TransactionTracker";
import { ManageStake } from "./ManageStake";
import { useApproveAst } from "./hooks/useApproveAst";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { TxType } from "./types/StakingTypes";
import { actionButtonsObject } from "./utils/actionButtonObject";
import { modalButtonActionsAndText } from "./utils/modalButtonActionsAndText";
import { modalTxLoadingStateHeadlines } from "./utils/modalTxLoadingStateHeadlines";

export const StakingModal = () => {
  const {
    setShowStakingModal,
    txType,
    setIsTxLoading,
    setTxStatus,
    setTxHash,
  } = useStakingModalStore();

  const formReturn = useForm();
  const { getValues } = formReturn;
  const stakingAmount = getValues().stakingAmount;

  // This state tracks whether the last transaction was an approval.
  const [isApproval, setIsApproval] = useState<boolean>(false);

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();

  const {
    unstakableSAstBalanceFormatted: unstakableSastBalance,
    astBalanceFormatted: astBalance,
  } = useTokenBalances();

  // stakingAmount default is NaN. Wagmi hooks need to validate that stakingAmount exists
  const validNumberInput = !!stakingAmount && Number(stakingAmount) > 0;

  const needsApproval =
    txType === TxType.STAKE &&
    Number(astAllowance) < Number(stakingAmount) &&
    validNumberInput;

  const canStake =
    txType === TxType.STAKE && !needsApproval && validNumberInput;

  const canUnstake =
    Number(stakingAmount) <= Number(unstakableSastBalance) &&
    txType === TxType.UNSTAKE &&
    validNumberInput;

  const isInsufficientBalance =
    txType === TxType.STAKE && stakingAmount
      ? Number(stakingAmount) > Number(astBalance)
      : Number(stakingAmount) > Number(unstakableSastBalance);

  const {
    writeAsync: approveAst,
    data: dataApproveAst,
    reset: resetApproveAst,
    isLoading: approvalAwaitingSignature,
  } = useApproveAst({
    stakingAmount: Number(stakingAmount) || 0,
    enabled: needsApproval,
  });

  const {
    writeAsync: stakeAst,
    reset: resetStakeAst,
    data: dataStakeAst,
    isLoading: stakeAwaitingSignature,
  } = useStakeAst({
    stakingAmount: Number(stakingAmount) || 0,
    enabled: canStake,
  });

  const {
    writeAsync: unstakeSast,
    reset: resetUnstakeSast,
    data: dataUnstakeSast,
    isLoading: unstakeAwaitingSignature,
  } = useUnstakeSast({
    unstakingAmount: Number(stakingAmount) || 0,
    canUnstake: canUnstake,
  });

  useEffect(() => {
    if (needsApproval) setIsApproval(true);
    if (unstakeAwaitingSignature || stakeAwaitingSignature)
      setIsApproval(false);
  }, [needsApproval, unstakeAwaitingSignature, stakeAwaitingSignature]);

  const currentTransactionHash =
    dataApproveAst?.hash || dataStakeAst?.hash || dataUnstakeSast?.hash;

  const { status: txStatus } = useWaitForTransaction({
    hash: currentTransactionHash,
    enabled: !!currentTransactionHash,
  });

  const modalButtonAction = modalButtonActionsAndText({
    txType,
    needsApproval,
    buttonActions: {
      approve: approveAst,
      stake: stakeAst,
      unstake: unstakeSast,
    },
    insufficientBalance: isInsufficientBalance,
  });

  const isAmountInvalid = Number(stakingAmount) <= 0;

  const isStakeButtonDisabled = isAmountInvalid || isInsufficientBalance;

  const actionButtons = actionButtonsObject({
    resetApproveAst,
    resetStakeAst,
    resetUnstakeSast,
  });

  const modalLoadingStateHeadlines = modalTxLoadingStateHeadlines(txStatus);

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

  const shouldShowTracker =
    stakeAwaitingSignature ||
    approvalAwaitingSignature ||
    unstakeAwaitingSignature ||
    !!currentTransactionHash;

  // Used in "you successfully {verb} {stakingAmount} AST"
  const verb = isApproval
    ? "approved"
    : txType === TxType.STAKE
    ? "staked"
    : "unstaked";

  // txStatus and isTxLoading gets set in Zustand store, then used to disable the close modal button in Modal.tsx if transaction is loading
  useEffect(() => {
    setIsTxLoading(
      approvalAwaitingSignature ||
        stakeAwaitingSignature ||
        unstakeAwaitingSignature,
    );
    setTxStatus(txStatus);
  }, [
    setIsTxLoading,
    approvalAwaitingSignature,
    stakeAwaitingSignature,
    unstakeAwaitingSignature,
    txStatus,
    setTxStatus,
  ]);

  useEffect(() => {
    currentTransactionHash ? setTxHash(currentTransactionHash) : null;
  }, [currentTransactionHash, setTxHash]);

  return (
    <Modal
      className="w-full max-w-none xs:max-w-[360px] text-white"
      heading={modalLoadingStateHeadlines}
      onCloseRequest={() => setShowStakingModal(false)}
    >
      {shouldShowTracker ? (
        <TransactionTracker
          actionButtons={actionButtonLogic()}
          successContent={
            <span>
              You successfully {verb}{" "}
              <span className="text-white">{stakingAmount} AST</span>
            </span>
          }
          failureContent={"Your transaction has failed"}
          signatureExplainer={
            isApproval
              ? "To stake AST you will first need to approve the token spend."
              : undefined
          }
          txHash={currentTransactionHash}
        />
      ) : (
        <>
          <ManageStake formReturn={formReturn} />
          <div>
            <Button
              onClick={modalButtonAction?.callback}
              disabled={isStakeButtonDisabled}
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
