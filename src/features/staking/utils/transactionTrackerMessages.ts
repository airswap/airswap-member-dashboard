import { TransactionState } from "../types/StakingTypes";

export const transactionTrackerMessages = {
  [TransactionState.ApprovePending]: {
    headline: "Approve token",
    message: "Token approval pending",
    description:
      "To stake your AST you will have to approve the token spent. Please the transaction in your wallet, your wallet should open. If your wallet doesn’t open please try again.",
  },
  [TransactionState.ApproveSuccess]: {
    headline: "Approve successful",
    message: "You successfully approved",
    description: null,
  },
  [TransactionState.StakePending]: {
    headline: "Pending transaction",
    message: "Transaction sign pending",
    description:
      "To stake your AST please sign the transaction in your wallet.  Your wallet should open, if your wallet doesn’t open please try again.",
  },
  [TransactionState.StakeSuccess]: {
    headline: "Transaction successful",
    message: "You've successfully staked",
    description: null,
  },
  [TransactionState.UnstakePending]: {
    headline: "Pending transaction",
    message: "Transaction sign pending",
    description:
      "To unstake your sAST please sign the transaction in your wallet.  Your wallet should open, if your wallet doesn’t open please try again.",
  },
  [TransactionState.UnstakeSuccess]: {
    headline: "Transaction successful",
    message: "You've successfully unstaked",
    description: null,
  },
  [TransactionState.Failed]: {
    headline: "Transaction failed",
    message: "Your transaction has failed",
    description:
      "It looks like something went wrong with your transaction, please try",
  },
  [TransactionState.Idle]: {
    headline: "Manage Stake",
    message: null,
    description: null,
  },
};
