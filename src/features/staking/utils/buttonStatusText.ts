import { StakeOrUnstake, Status } from "../types/StakingTypes";

/**
 *
 * @remarks used in StakingModal.tsx file. Function returns a string that gets rendered onto the button component
 */
export const buttonStatusText = ({
  stakeOrUnstake,
  needsApproval,
  statusApprove,
  statusStake,
  statusUnstake,
}: {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
}) => {
  // if statusApprove === "loading" && !needsApproval, button should still read "staking"
  if (stakeOrUnstake === StakeOrUnstake.UNSTAKE) {
    if (statusUnstake === "idle") {
      return "Unstake";
    } else if (statusUnstake === "loading") {
      return "Unstaking...";
    } else if (statusUnstake === "success") {
      return "Manage stake";
    }
  }

  // without `statusApprove !== "loading"`, the text will flash from "Staking..." to "Stake" during intermittent state changes of `statusApprove
  if (!needsApproval && statusApprove !== "loading") {
    if (statusStake === "idle") {
      return "Stake";
    } else if (statusStake === "loading") {
      return "Staking...";
    } else if (statusStake === "success") {
      return "Manage stake";
    }
  }

  // after `statusStake === "success"`, `needsApproval` will reset to true
  if (needsApproval) {
    if (statusStake === "success") {
      return "Manage stake";
    } else if (statusApprove === "idle") {
      return "Approve token";
    } else if (statusApprove === "loading") {
      return "Approving...";
    }
  }
};
