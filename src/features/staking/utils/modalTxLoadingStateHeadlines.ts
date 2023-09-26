import { Status } from "../types/StakingTypes";

export const modalTxLoadingStateHeadlines = (txStatus: Status) => {
  if (txStatus === "loading") {
    return "Transaction submitted";
  } else if (txStatus === "success") {
    return "Transaction successful";
  } else if (txStatus === "error") {
    return "Transaction failed";
  } else {
    return "Manage Stake";
  }
};
