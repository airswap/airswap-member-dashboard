import { WriteContractResult } from "wagmi/actions";
import { Status } from "../types/StakingTypes";

export const transactionTrackerMessages = ({
  txStatus,
  dataApproveAst,
  dataStakeAst,
  dataUnstakeSast,
}: {
  txStatus: Status;
  dataApproveAst: WriteContractResult | undefined;
  dataStakeAst: WriteContractResult | undefined;
  dataUnstakeSast: WriteContractResult | undefined;
}) => {
  if (dataApproveAst && txStatus === "loading") {
    return "Your transaction to approve AST is processing. Please wait a moment.";
  } else if (dataStakeAst && txStatus === "loading") {
    return "Your transaction to stake AST is processing. Please wait a moment.";
  } else if (dataUnstakeSast && txStatus === "loading") {
    return "Your transaction to unstake AST is processing. Please wait a moment.";
  } else if (txStatus === "error") {
    return "It looks like something went wrong with your transaction. Please try again";
  } else {
    return undefined;
  }
};
