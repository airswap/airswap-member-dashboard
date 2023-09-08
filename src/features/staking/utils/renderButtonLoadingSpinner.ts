import { StakeOrUnstake, Status } from "../types/StakingTypes";

/**
 *
 * @remarks gets used in StakingModal.tsx file. Function returns a boolean that gets passed into <Button> and determines if it should render a loading spinner
 */

export const renderButtonLoadingSpinner = ({
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
  if (needsApproval && statusApprove === "loading") {
    return true;
  } else if (!needsApproval && statusStake === "loading") {
    return true;
  } else if (unstaking && statusUnstake === "loading") {
    return true;
  } else {
    return false;
  }
};
