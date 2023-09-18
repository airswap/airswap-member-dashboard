import { useForm } from "react-hook-form";
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
import { modalButtonActionsAndText } from "./utils/modalButtonActionsAndText";
import { transactionTrackerMessages } from "./utils/transactionTrackerMessages";

export const StakingModal = () => {
  const { setShowStakingModal, txType, setTxType } = useStakingModalStore();

  const formReturn = useForm();
  const { watch } = formReturn;
  const stakingAmount = watch("stakingAmount") || "0";

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();

  const {
    ustakableSAstBalanceFormatted: unstakableSastBalance,
    astBalanceFormatted: astBalance,
  } = useTokenBalances();

  const needsApproval =
    txType === TxType.STAKE &&
    +stakingAmount > 0 &&
    +astAllowance < +stakingAmount;

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

  const activeTxHash =
    dataApproveAst?.hash || dataStakeAst?.hash || dataUnstakeSast?.hash;

  // if transaction is processing, return it's status
  const { status: txStatus } = useWaitForTransaction({
    hash: activeTxHash,
    enabled: !!activeTxHash,
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

  const isStakeButtonDisabled =
    +stakingAmount <= 0 ||
    (txType === TxType.STAKE && stakingAmount > astBalance) ||
    (txType === TxType.UNSTAKE && stakingAmount > unstakableSastBalance);

  const successText = <AmountStakedText stakingAmount={stakingAmount} />;
  const actionDescription = transactionTrackerMessages({ txType, txStatus });
  const transactionHashes =
    dataApproveAst?.hash || dataStakeAst?.hash || dataUnstakeSast?.hash;

  const actionButtons = {
    afterSuccess: {
      label: "Manage Stake",
      callback: resetStakeAst,
    },
    afterFailure: {
      label: "Try again",
      callback: resetUnstakeSast,
    },
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
          actionButtons={actionButtons}
          txHash={transactionHashes}
        />
      ) : (
        <>
          <ManageStake formReturn={formReturn} />
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
