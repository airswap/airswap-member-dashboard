import { twJoin } from "tailwind-merge";
import { WriteContractResult } from "wagmi/actions";
import { useStakingModalStore } from "../store/useStakingModalStore";
import { Status, TxType } from "../types/StakingTypes";

export const AmountStakedText = ({
  stakingAmount,
  txStatus,
  dataApproveAst,
  dataStakeAst,
  dataUnstakeSast,
}: {
  stakingAmount: string;
  txStatus: Status;
  dataApproveAst: WriteContractResult | undefined;
  dataStakeAst: WriteContractResult | undefined;
  dataUnstakeSast: WriteContractResult | undefined;
}) => {
  const { txType } = useStakingModalStore();
  const staking = txType === TxType.STAKE;
  const success = txStatus === "success";

  const successTextOptions = () => {
    if (dataApproveAst && success) {
      return "You successfully approved";
    } else if (dataStakeAst && success) {
      return "You successfully staked";
    } else if (dataUnstakeSast && success) {
      return "You successfull unstaked";
    }
  };

  const successText = successTextOptions();

  return (
    <div
      className={twJoin(
        "flex flex-row my-4 flex-wrap",
        txStatus !== "success" && "hidden",
      )}
    >
      <span>{successText}</span>
      <span className="ml-2 font-medium text-white">
        <span>{stakingAmount}</span>
        <span className="ml-1">{staking ? "AST" : "sAST"}</span>
      </span>
    </div>
  );
};
