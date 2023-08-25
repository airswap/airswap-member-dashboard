import { StakeOrUnstake, StakingStatus } from "../types/StakingTypes";

export const buttonStatusText = (
  statusStaking: StakingStatus,
  stakeOrUnstake: StakeOrUnstake,
) => {
  if (stakeOrUnstake === "stake") {
    switch (statusStaking) {
      case "unapproved":
        return "Approve token";
      case "readyToStake":
        return "Stake";
      case "success":
        return "Manage stake";
      case "failed":
        return "Try again";
    }
  } else {
    return "Unstake";
  }
};

export const modalHeadline = (statusStaking: StakingStatus) => {
  switch (statusStaking) {
    case "unapproved":
      return "Manage Stake";
    case "approving":
      return "Approve token";
    case "approved":
      return "Approve successful";
    case "readyToStake":
      return "Manage stake";
    case "staking":
      return "Sign transaction";
    case "success":
      return "Transaction successful";
    case "failed":
      return "Transaction failed";
  }
};

export const shouldRenderBtn = (statusStaking: StakingStatus) => {
  if (
    statusStaking === "approving" ||
    statusStaking === "approved" ||
    statusStaking === "staking"
  ) {
    return true;
  } else {
    return false;
  }
};

export const etherscanLink = (
  chainId: number,
  transactionHash: string | undefined,
) => {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/tx/${transactionHash}`;
    case 5:
      return `https://goerli.etherscan.io/tx/${transactionHash}`;
  }
};
