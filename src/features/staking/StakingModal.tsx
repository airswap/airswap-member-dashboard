import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSwitchNetwork, useWaitForTransaction } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { TransactionTracker } from "../common/TransactionTracker";
import { formatNumber } from "../common/utils/formatNumber";
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
  const { setShowStakingModal, txType, setTxHash } = useStakingModalStore();

  const formReturn = useForm();
  const { getValues } = formReturn;
  const stakingAmountNumberFormat = getValues().stakingAmount;
  const stakingAmount = BigInt(stakingAmountNumberFormat);

  const isSupportedChain = useChainSupportsStaking();
  const { switchNetwork } = useSwitchNetwork();

  // This state tracks whether the last transaction was an approval.
  const [isApproval, setIsApproval] = useState<boolean>(false);

  const { astAllowance } = useAstAllowance();
  console.log(astAllowance);

  const {
    unstakableSastBalanceRaw: unstakableSastBalance,
    astBalanceRaw: astBalance,
  } = useTokenBalances();

  const { sAstBalanceV4Deprecated: sAstV4Balance } = useStakesForAccount();

  const isStakeAmountAndStakeType = txType === TxType.STAKE && !!stakingAmount;

  // TODO: if `!!stakingAmount works as intended, delete `validNumberInput` and this comment
  // const validNumberInput = !!stakingAmountFormatted && Number(stakingAmountFormatted) * 10 ** 4 > 0;

  // TODO: delete following comment if `needsApproval` in the following line works as intended
  // const needsApproval =  txType === TxType.STAKE && Number(astAllowance) < Number(stakingAmountFormatted) * 10 ** 4 && !!stakingAmount;

  const needsApproval =
    isStakeAmountAndStakeType && !!astAllowance && astAllowance < stakingAmount;

  const canStake = isStakeAmountAndStakeType && !needsApproval;

  const canUnstake =
    isStakeAmountAndStakeType && stakingAmount <= unstakableSastBalance;

  const isInsufficientBalance = isStakeAmountAndStakeType
    ? stakingAmount > astBalance
    : stakingAmount > unstakableSastBalance;

  const {
    writeAsync: approveAst,
    data: dataApproveAst,
    reset: resetApproveAst,
    isLoading: approvalAwaitingSignature,
  } = useApproveAst({
    stakingAmount,
    enabled: !!needsApproval,
  });

  const {
    writeAsync: stakeAst,
    reset: resetStakeAst,
    data: dataStakeAst,
    isLoading: stakeAwaitingSignature,
  } = useStakeAst({
    stakingAmount,
    enabled: canStake,
  });

  const {
    writeAsync: unstakeSast,
    reset: resetUnstakeSast,
    data: dataUnstakeSast,
    isLoading: unstakeAwaitingSignature,
  } = useUnstakeSast({
    unstakingAmount: stakingAmount,
    enabled: canUnstake,
  });

  const {
    writeAsync: unstakeSastV4Deprecated,
    reset: resetUnstakeSastV4Deprecated,
    data: dataUnstakeSastV4Deprecated,
    isLoading: unstakeAwaitingSignatureV4Deprecated,
  } = useUnstakeSast({
    unstakingAmount: sAstV4Balance,
    contractVersion: ContractVersion.V4,
    enabled: !!sAstV4Balance,
  });

  console.log(unstakeSastV4Deprecated);

  useEffect(() => {
    // after successfully staking, `needsApproval` will reset to true. We need `dataStakeAst` to be falsey to set `isApproval` to true, otherwise const `verb` will show as "approved" after the user has staked
    if (needsApproval && !dataStakeAst) {
      setIsApproval(true);
    }
    if (unstakeAwaitingSignature || stakeAwaitingSignature)
      setIsApproval(false);
  }, [
    needsApproval,
    dataStakeAst,
    unstakeAwaitingSignature,
    stakeAwaitingSignature,
  ]);

  const currentTransactionHash =
    dataApproveAst?.hash || dataStakeAst?.hash || dataUnstakeSast?.hash;

  const { status: txStatus } = useWaitForTransaction({
    hash: currentTransactionHash,
    enabled: !!currentTransactionHash,
  });

  const modalButtonAction = modalButtonActionsAndText({
    isSupportedNetwork: isSupportedChain,
    txType,
    needsApproval,
    buttonActions: {
      switchNetwork: () => switchNetwork?.(1),
      approve: approveAst,
      stake: stakeAst,
      unstake: unstakeSast,
      unstakeV4Deprecated: unstakeSastV4Deprecated,
    },
    insufficientBalance: isInsufficientBalance,
    unstakeV4Deprecated: !!unstakeSastV4Deprecated,
  });

  const isAmountInvalid = stakingAmount <= 0;

  const isStakeButtonDisabled = isAmountInvalid || isInsufficientBalance;

  const actionButtons = actionButtonsObject({
    resetApproveAst,
    resetStakeAst,
    resetUnstakeSast,
    resetUnstakeSastV4Deprecated,
    formReturn,
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
  const verb = isApproval
    ? "approved"
    : txType === TxType.STAKE
    ? "staked"
    : "unstaked";

  // Used to disable close button in Modal.tsx
  const txIsLoading =
    approvalAwaitingSignature ||
    stakeAwaitingSignature ||
    unstakeAwaitingSignature ||
    unstakeAwaitingSignatureV4Deprecated ||
    txStatus === "loading";

  const formattedStakingAmount = formatNumber(stakingAmount, 4);

  useEffect(() => {
    currentTransactionHash ? setTxHash(currentTransactionHash) : null;
  }, [currentTransactionHash, setTxHash]);

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
              <span className="text-white">{formattedStakingAmount} AST</span>
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
