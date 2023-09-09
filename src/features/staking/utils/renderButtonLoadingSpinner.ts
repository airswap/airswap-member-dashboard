import { Status } from "../types/StakingTypes";

/**
 *
 * @remarks button spinner renders when a transaction is in "loading" status. Gets used in StakingModal.tsx file.
 * @returns boolean that gets passed into <Button> and determines if it should render a loading spinner
 */
export const renderButtonLoadingSpinner = ({
  statusApprove,
  statusStake,
  statusUnstake,
}: {
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
}): boolean => {
  return (
    statusApprove === "loading" ||
    statusStake === "loading" ||
    statusUnstake === "loading"
  );
};
