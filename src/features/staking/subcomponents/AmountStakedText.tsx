import { twJoin } from "tailwind-merge";
import { TxType, useStakingModalStore } from "../store/useStakingModalStore";
import { Status } from "../types/StakingTypes";

export const AmountStakedText = ({
  stakingAmount,
  txStatus,
}: {
  stakingAmount: string;
  txStatus: Status;
}) => {
  const { txType } = useStakingModalStore();
  const staking = txType === TxType.STAKE;
  const successText = staking
    ? "You successfully staked"
    : "You successfully unstaked";
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
