import { Dispatch } from "react";
import {
  Status,
  TransactionTrackerStatus,
} from "../../staking/types/StakingTypes";

/**
 *
 * @remarks used in TransactionTracker.tsx
 */
export const trackerStatusTransactionType = ({
  statusApprove,
  statusStake,
  statusUnstake,
  isError,
  setTrackerStatus,
}: {
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
  isError: boolean;
  setTrackerStatus: Dispatch<TransactionTrackerStatus | undefined>;
}) => {
  if (statusApprove === "loading") {
    setTrackerStatus("ApprovePending");
  } else if (statusApprove === "success") {
    setTrackerStatus("ApproveSuccess");
  } else if (statusStake === "loading") {
    setTrackerStatus("StakePending");
  } else if (statusStake === "success") {
    setTrackerStatus("StakeSuccess");
  } else if (statusUnstake === "loading") {
    setTrackerStatus("UnstakePending");
  } else if (statusUnstake === "success") {
    setTrackerStatus("UnstakeSuccess");
  } else if (isError) {
    setTrackerStatus("Failed");
  } else {
    setTrackerStatus(undefined);
  }
};
