import { StatusStaking } from "../types/StakingTypes";

export const modalHeadline = (statusStaking: StatusStaking) => {
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
