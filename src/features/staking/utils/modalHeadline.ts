import { Status } from "../types/StakingTypes";

export const modalHeadline = ({
  statusStake,
  statusUnstake,
}: {
  statusStake: Status;
  statusUnstake: Status;
}) => {
  if (statusStake === "success" || statusUnstake === "success") {
    return "Transaction successful";
  } else if (statusStake === "error" || statusUnstake === "error") {
    return "Transaction failed";
  } else {
    return "Manage Stake";
  }
};
