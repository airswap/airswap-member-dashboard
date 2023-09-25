import greenCheck from "../../../assets/check-green.svg";
import redX from "../../../assets/close-red.svg";
import loadingSpinner from "../../../assets/loading-spinner.svg";
import { Status } from "../types/StakingTypes";

export const transactionTrackerIcon = (status: Status) => {
  if (status === "loading") {
    return loadingSpinner;
  } else if (status === "success") {
    return greenCheck;
  } else if (status === "error") {
    return redX;
  } else {
    return undefined;
  }
};
