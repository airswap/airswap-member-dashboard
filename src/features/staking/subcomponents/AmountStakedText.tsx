import { TxType, useStakingModalStore } from "../store/useStakingModalStore";

export const AmountStakedText = ({
  stakingAmount,
}: {
  stakingAmount: string;
}) => {
  const { txType } = useStakingModalStore();
  const staking = txType === TxType.STAKE;
  const successText = staking
    ? "You successfully staked"
    : "You successfully unstaked";
  return (
    <div className="flex flex-row my-4 flex-wrap">
      <span>{successText}</span>
      <span className="ml-2 font-medium text-white">
        <span>{stakingAmount}</span>
        <span className="ml-1">{staking ? "AST" : "sAST"}</span>
      </span>
    </div>
  );
};
