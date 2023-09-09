import { Dispatch } from "react";
import { Status, TransactionState } from "../../staking/types/StakingTypes";

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
  setTrackerStatus: Dispatch<TransactionState>;
}) => {
  if (statusApprove === "loading") {
    setTrackerStatus(TransactionState.ApprovePending);
  } else if (statusApprove === "success") {
    setTrackerStatus(TransactionState.ApproveSuccess);
  } else if (statusStake === "loading") {
    setTrackerStatus(TransactionState.StakePending);
  } else if (statusStake === "success") {
    setTrackerStatus(TransactionState.StakeSuccess);
  } else if (statusUnstake === "loading") {
    setTrackerStatus(TransactionState.UnstakePending);
  } else if (statusUnstake === "success") {
    setTrackerStatus(TransactionState.UnstakeSuccess);
  } else if (isError) {
    setTrackerStatus(TransactionState.Failed);
  } else {
    setTrackerStatus(TransactionState.Idle);
  }
};
