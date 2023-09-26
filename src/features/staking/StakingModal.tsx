import { useEffect } from "react";
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
  const { setShowStakingModal, txType, setTxHash, stakingAmount } =
    useStakingModalStore();

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();

  const {
    unstakableSAstBalanceFormatted: unstakableSastBalance,
    astBalanceFormatted: astBalance,
  } = useTokenBalances();

  const needsApproval =
    txType === TxType.STAKE &&
    Number(stakingAmount) > 0 &&
    Number(astAllowance) < Number(stakingAmount);

  const canStake = txType === TxType.STAKE && !needsApproval;

  const canUnstake =
    Number(stakingAmount) <= Number(unstakableSastBalance) &&
    txType === TxType.UNSTAKE;

  const { approveAst, dataApproveAst, resetApproveAst } = useApproveAst({
    stakingAmount: Number(stakingAmount),
    enabled: needsApproval,
  });

  const { stakeAst, resetStakeAst, dataStakeAst } = useStakeAst({
    stakingAmount: Number(stakingAmount),
    enabled: canStake,
  });

  const { unstakeSast, resetUnstakeSast, dataUnstakeSast } = useUnstakeSast({
    unstakingAmount: Number(stakingAmount),
    canUnstake,
  });

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
  });

  const isAmountInvalid = Number(stakingAmount) <= 0;
  const insufficientAstBalance =
    txType === TxType.STAKE && Number(stakingAmount) > Number(astBalance);
  const insufficientSastBalance =
    txType === TxType.UNSTAKE && stakingAmount > unstakableSastBalance;

  const isStakeButtonDisabled =
    isAmountInvalid || insufficientAstBalance || insufficientSastBalance;

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

  useEffect(() => {
    currentTransactionHash ? setTxHash(currentTransactionHash) : null;
  }, [currentTransactionHash, setTxHash]);

  return (
    <Modal
      className="w-full max-w-none xs:max-w-[360px] text-white"
      modalHeadline={modalLoadingStateHeadlines}
      onCloseRequest={() => setShowStakingModal(false)}
    >
      {txStatus !== "idle" ? (
        <TransactionTracker
          actionButtons={actionButtonLogic()}
          dataApproveAst={dataApproveAst}
          dataStakeAst={dataStakeAst}
          dataUnstakeSast={dataUnstakeSast}
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
