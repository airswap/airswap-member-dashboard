import { TransactionState } from "../types/StakingTypes";

export const transactionTrackerMessages = {
  [TransactionState.ApprovePending]: {
    headline: "Approving",
    message: "Approval transaction pending",
    description:
      "Staking your AST involves two steps: First, allow the AirSwap Staking contract to access your tokens. Then, stake your tokens to the contract. Your approval transaction is currently in progress. Please wait, and if it fails, try again.",
  },
  [TransactionState.ApproveSuccess]: {
    headline: "Approve successful",
    message: "You successfully approved",
    description: null,
  },
  [TransactionState.StakePending]: {
    headline: "Staking",
    message: "Staking transaction pending",
    description:
      "The transaction to stake your AST tokens is pending. Upon completion, you'll see a green checkmark and a link to Etherscan. Please wait, and if it fails, try again.",
  },
  [TransactionState.StakeSuccess]: {
    headline: "Staking successful",
    message: "You've successfully staked",
    description: null,
  },
  [TransactionState.UnstakePending]: {
    headline: "Unstaking",
    message: "Unstaking transaction pending",
    description:
      "The transaction to unstake your aAST tokens is pending. Upon completion, you'll see a green checkmark and a link to Etherscan. Please wait, and if it fails, try again.",
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
