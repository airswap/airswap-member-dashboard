import { WriteContractResult } from "wagmi/actions";
import { Status } from "../types/StakingTypes";

export const AmountStakedText = ({
  dataApproveAst,
  dataStakeAst,
  dataUnstakeSast,
  txStatus,
}: {
  dataApproveAst: WriteContractResult | undefined;
  dataStakeAst: WriteContractResult | undefined;
  dataUnstakeSast: WriteContractResult | undefined;
  txStatus: Status;
}) => {
  if (dataApproveAst && txStatus === "success") {
    return "You successfully approved";
  } else if (dataStakeAst && txStatus === "success") {
    return "You successfully staked";
  } else if (dataUnstakeSast && txStatus === "success") {
    return "You successfull unstaked";
  } else {
    return undefined;
  }
};
