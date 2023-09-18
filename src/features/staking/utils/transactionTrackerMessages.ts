import { TxType } from "../store/useStakingModalStore";
import { Status } from "../types/StakingTypes";

export const transactionTrackerMessages = ({
  txType,
  txStatus,
}: {
  txType: TxType;
  txStatus: Status;
}) => {
  const stake = txType === TxType.STAKE;
  const unstake = txType === TxType.UNSTAKE;
  if (stake && txStatus === "loading") {
    return "Your transaction to stake AST is processing. Please wait a moment.";
  } else if (unstake && txStatus === "loading") {
    return "Your transaction to unstake AST is processing. Please wait a moment.";
  } else if (txStatus === "error") {
    return "It looks like something went wrong with your transaction. Please try again";
  } else {
    return undefined;
  }
};
