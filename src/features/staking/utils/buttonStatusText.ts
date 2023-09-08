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
  const unstaking = stakeOrUnstake === StakeOrUnstake.UNSTAKE;
  if (unstaking && statusUnstake === "idle") {
    return "Unstake";
  } else if (unstaking && statusUnstake === "loading") {
    return "Unstaking...";
  } else if (unstaking && statusUnstake === "success") {
    return "Manage stake";
  } else if (statusStake === "success") {
    return "Manage Stake";
  } else if (needsApproval && statusApprove === "idle") {
    return "Approve token";
  } else if (needsApproval && statusApprove === "loading") {
    return "Approving...";
  } else if (!needsApproval && statusStake === "idle") {
    return "Stake";
  } else if (!needsApproval && statusStake === "loading") {
    return "Staking...";
  }
};
