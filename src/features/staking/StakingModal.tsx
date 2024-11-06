import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSwitchNetwork, useWaitForTransaction } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { TransactionTracker } from "../common/TransactionTracker";
import { ManageStake } from "./ManageStake";
import { useApproveAst } from "./hooks/useApproveAst";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useChainSupportsStaking } from "./hooks/useChainSupportsStaking";
import { useStakeAst } from "./hooks/useStakeAst";
import { useStakesForAccount } from "./hooks/useStakesForAccount";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { ContractVersion, TxType } from "./types/StakingTypes";
import { actionButtonsObject } from "./utils/actionButtonObject";
import { modalButtonActionsAndText } from "./utils/modalButtonActionsAndText";
import { modalTxLoadingStateHeadlines } from "./utils/modalTxLoadingStateHeadlines";

export const StakingModal = () => {
  const {
    setShowStakingModal,
    txType,
    setTxHash,
    v4UnstakingBalance,
    setV4UnstakingBalance,
    approvalEventLog,
  } = useStakingModalStore();

  const formReturn = useForm();
  const { getValues } = formReturn;
  const stakingAmount = BigInt(
    new BigNumber(getValues().stakingAmount || 0)
      .multipliedBy(10 ** 4)
      .toString(),
  );

  const isSupportedChain = useChainSupportsStaking();
  const { switchNetwork } = useSwitchNetwork();

  // This state tracks whether the last transaction was an approval.
  const [isApproval, setIsApproval] = useState<boolean>(false);

  const { astAllowance } = useAstAllowance();

  const {
    unstakableSastBalanceRaw: unstakableSastBalance,
    astBalanceRaw: astBalance,
  } = useTokenBalances();

  const {
    sAstBalanceV4Deprecated: sAstV4Balance,
    sAstMaturityV4Deprecated,
    sAstTimestampV4Deprecated,
  } = useStakesForAccount();

  const isStakeAmountAndStakeType = txType === TxType.STAKE && !!stakingAmount;

  // check if allowance is less than amount user wants to stake
  const needsApproval =
    (isStakeAmountAndStakeType && astAllowance === 0n) ||
    (!!astAllowance && astAllowance < stakingAmount);

  const canUnstake =
    txType === TxType.UNSTAKE && stakingAmount <= unstakableSastBalance;

  const isInsufficientBalance =
    txType === TxType.STAKE
      ? stakingAmount > astBalance
      : stakingAmount > unstakableSastBalance;

  const isStakeButtonDisabled = stakingAmount <= 0 || isInsufficientBalance;

  const {
    approveAst,
    data: dataApproveAst,
    reset: resetApproveAst,
    isLoading: approvalAwaitingSignature,
  } = useApproveAst({
    stakingAmount: stakingAmount,
    enabled: stakingAmount > 0n && !!needsApproval,
  });

  const {
    writeAsync: stakeAst,
    reset: resetStakeAst,
    data: dataStakeAst,
    isLoading: stakeAwaitingSignature,
  } = useStakeAst({
    stakingAmount: stakingAmount,
    enabled: stakingAmount > 0n && !needsApproval && txType === TxType.STAKE,
  });

  const {
    writeAsync: unstakeSast,
    reset: resetUnstakeSast,
    data: dataUnstakeSast,
    isLoading: unstakeAwaitingSignature,
  } = useUnstakeSast({
    unstakingAmount: stakingAmount,
    enabled: stakingAmount > 0n && canUnstake && txType === TxType.UNSTAKE,
  });

  const enableV4Unstake = Boolean(
    sAstV4Balance! > 0 &&
      sAstMaturityV4Deprecated &&
      sAstTimestampV4Deprecated! < sAstMaturityV4Deprecated && // this causes a revert if false
      sAstMaturityV4Deprecated <= Date.now() / 1000,
  );

  const {
    writeAsync: unstakeSastV4Deprecated,
    reset: resetUnstakeSastV4Deprecated,
    data: dataUnstakeSastV4Deprecated,
    isLoading: unstakeAwaitingSignatureV4Deprecated,
  } = useUnstakeSast({
    unstakingAmount: sAstV4Balance,
    contractVersion: ContractVersion.V4,
    enabled: enableV4Unstake,
  });

  const currentTransactionHash =
    dataApproveAst?.hash ||
    dataStakeAst?.hash ||
    dataUnstakeSast?.hash ||
    dataUnstakeSastV4Deprecated?.hash;

  const { status: txStatus } = useWaitForTransaction({
    hash: currentTransactionHash,
    enabled: !!currentTransactionHash,
  });

  const isV4UnstakeSuccess =
    dataUnstakeSastV4Deprecated?.hash && txStatus === "success";

  // don't pass in unstakeV4Deprecated actions because that is only handled in the content box in ManageStake
  const modalButtonAction = modalButtonActionsAndText({
    isSupportedNetwork: isSupportedChain,
    txType,
    needsApproval,
    buttonActions: {
      switchNetwork: () => switchNetwork?.(1),
      approve: approveAst,
      stake: stakeAst,
      unstake: unstakeSast,
    },
    isInsufficientBalance,
  });

  const actionButtons = actionButtonsObject({
    resetApproveAst,
    resetStakeAst,
    resetUnstakeSast,
    resetUnstakeSastV4Deprecated,
    formReturn,
    setV4UnstakingBalance,
  });

  const modalLoadingStateHeadlines = modalTxLoadingStateHeadlines(txStatus);

  const actionButtonLogic = () => {
    if (dataApproveAst) {
      return actionButtons.approve;
    } else if (dataStakeAst) {
      return actionButtons.stake;
    } else if (dataUnstakeSast) {
      return actionButtons.unstake;
    } else if (dataUnstakeSastV4Deprecated) {
      return actionButtons.unstakeV4Deprecated;
    } else {
      return undefined;
    }
  };

  const shouldShowTracker =
    stakeAwaitingSignature ||
    approvalAwaitingSignature ||
    unstakeAwaitingSignature ||
    unstakeAwaitingSignatureV4Deprecated ||
    !!currentTransactionHash;

  // Used in "you successfully {verb} {stakingAmount} AST"
  const handleVerb = () => {
    if (txType === TxType.UNSTAKE) {
      return "unstaked";
    } else if (isApproval && !dataUnstakeSastV4Deprecated?.hash) {
      return "approved";
    } else if (!isApproval && dataStakeAst?.hash) {
      return "staked";
    } else {
      return;
    }
  };
  const verb = handleVerb();

  const amountApproved = approvalEventLog
    ? BigInt(approvalEventLog)
    : undefined;

  // pass the following in after `verb` to check if v4 was unstaked
  const transactionTrackerBalance =
    verb === "approved"
      ? // ? Number(allowanceData) / 10 ** 4
        Number(amountApproved?.toString()) / 10 ** 4 || 0
      : isV4UnstakeSuccess
      ? Number(v4UnstakingBalance) / 10 ** 4
      : Number(stakingAmount) / 10 ** 4;

  // Used to disable close button in Modal.tsx
  const txIsLoading =
    approvalAwaitingSignature ||
    stakeAwaitingSignature ||
    unstakeAwaitingSignature ||
    unstakeAwaitingSignatureV4Deprecated ||
    txStatus === "loading";

  useEffect(() => {
    currentTransactionHash ? setTxHash(currentTransactionHash) : null;
  }, [currentTransactionHash, setTxHash]);

  useEffect(() => {
    // after successfully staking, `needsApproval` will reset to true. We need `dataStakeAst` to be falsey to set `isApproval` to true, otherwise const `verb` will show as "approved" after the user has staked
    if (needsApproval && !dataStakeAst) {
      setIsApproval(true);
    } else if (unstakeAwaitingSignature || stakeAwaitingSignature)
      setIsApproval(false);
  }, [
    needsApproval,
    dataStakeAst,
    unstakeAwaitingSignature,
    stakeAwaitingSignature,
  ]);

  return (
    <Modal
      className="w-full max-w-none xs:max-w-[360px] text-white"
      heading={modalLoadingStateHeadlines}
      isClosable={!txIsLoading}
      onCloseRequest={() => setShowStakingModal(false)}
    >
      {shouldShowTracker ? (
        <TransactionTracker
          actionButtons={actionButtonLogic()}
          successContent={
            <span>
              You successfully {verb}{" "}
              <span className="text-white">
                {transactionTrackerBalance} AST
              </span>
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
          <ManageStake
            formReturn={formReturn}
            unstakeSastV4Deprecated={unstakeSastV4Deprecated}
          />
          <div>
            <Button
              onClick={modalButtonAction?.callback}
              disabled={isStakeButtonDisabled}
              color="primary"
              rounded={false}
              className="w-full mt-8"
            >
              {modalButtonAction?.label}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
