import { StatusStaking } from "../types/StakingTypes";

export const buttonStatusText = (statusStaking: StatusStaking) => {
  switch (statusStaking) {
    case 'unapproved':
      return "Approve token";
    case "readyToStake":
      return "Stake"
    case "success":
      return "Manage stake";
    case "failed":
      return "Try again"
  }
}
