import { WriteContractResult } from "wagmi/actions";
import { Status } from "../../staking/types/StakingTypes";

export const transactionTextLogic = ({
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
  const action = () => {
    if (dataApproveAst) {
      return "approve AST";
    } else if (dataStakeAst) {
      return "stake AST";
    } else if (dataUnstakeSast) {
      return "unstake sAST";
    } else {
      return undefined;
    }
  };

  if (txStatus === "loading") {
    return `Your transaction to ${action()} is processing. Please wait a moment`;
  } else if (txStatus === "error") {
    return "Something went wrong with your transaction. Please try again";
  } else {
    return undefined;
  }
};
