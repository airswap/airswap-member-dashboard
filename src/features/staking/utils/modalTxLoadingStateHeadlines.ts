import { WriteContractResult } from "wagmi/actions";
import { Status } from "../types/StakingTypes";

export const modalTxLoadingStateHeadlines = ({
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
  const loading = txStatus === "loading";
  const success = txStatus === "success";
  if (dataApproveAst && loading) {
    return "Approving...";
  } else if (dataApproveAst && success) {
    return "Approve successful";
  } else if (dataStakeAst && loading) {
    return "Staking...";
  } else if (dataStakeAst && success) {
    return "Staking successful";
  } else if (dataUnstakeSast && loading) {
    return "Unstaking...";
  } else if (dataUnstakeSast && success) {
    return "Unstaking successful";
  } else {
    return "Manage Stake";
  }
};
