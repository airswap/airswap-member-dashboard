import { Status } from "../types/StakingTypes";

export const modalTxLoadingStateHeadlines = (txStatus: Status) => {
  if (txStatus === "loading") {
    return "Processing";
  } else if (txStatus === "success") {
    return "Success";
  } else if (txStatus === "error") {
    return "Failed";
  } else {
    return "Staking";
  }
};
