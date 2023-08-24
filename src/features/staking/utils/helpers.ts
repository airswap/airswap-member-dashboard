import { StakingStatus } from "../types/StakingTypes";

export const buttonStatusText = (statusStaking: StakingStatus) => {
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
