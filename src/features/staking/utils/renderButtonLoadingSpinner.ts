import { Status } from "../types/StakingTypes";

/**
 *
 * @remarks gets used in StakingModal.tsx file. Function returns a boolean that gets passed into <Button> and determines if it should render a loading spinner
 */
export const renderButtonLoadingSpinner = ({
  statusApprove,
  statusStake,
  statusUnstake,
}: {
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
}) => {
  if (
    statusApprove === "loading" ||
    statusStake === "loading" ||
    statusUnstake === "loading"
  ) {
    return true;
  } else {
    return false;
  }
};
