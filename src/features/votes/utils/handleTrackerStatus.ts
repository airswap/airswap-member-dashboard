import { Dispatch } from "react";
import {
  TransactionState,
  TransactionStatusLookup,
} from "../../staking/types/StakingTypes";

export const handleTrackerStatus = ({
  transactionStatusLookup,
  isError,
  setTrackerStatus,
}: {
  transactionStatusLookup: TransactionStatusLookup;
  isError: boolean;
  setTrackerStatus: Dispatch<TransactionState>;
}) => {
  if (transactionStatusLookup.statusApproveAst === "loading") {
    setTrackerStatus(TransactionState.ApprovePending);
  } else if (transactionStatusLookup.statusApproveAst === "success") {
    setTrackerStatus(TransactionState.ApproveSuccess);
  } else if (transactionStatusLookup.statusStakeAst === "loading") {
    setTrackerStatus(TransactionState.StakePending);
  } else if (transactionStatusLookup.statusStakeAst === "success") {
    setTrackerStatus(TransactionState.StakeSuccess);
  } else if (transactionStatusLookup.statusUnstakeSast === "loading") {
    setTrackerStatus(TransactionState.UnstakePending);
  } else if (transactionStatusLookup.statusUnstakeSast === "success") {
    setTrackerStatus(TransactionState.UnstakeSuccess);
  } else if (isError) {
    setTrackerStatus(TransactionState.Failed);
  }
  // else {
  //   setTrackerStatus(TransactionState.Idle);
  // }
};
