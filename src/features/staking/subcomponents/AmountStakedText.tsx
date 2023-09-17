import { TxType, useStakingModalStore } from "../store/useStakingModalStore";

export const AmountStakedText = (stakingAmount: string) => {
  const { txType } = useStakingModalStore();
  return (
    <>
      <div className="flex flex-row my-4 flex-wrap">{actionDescription}</div>
      <span className="ml-2 font-medium text-white">
        <span>{stakingAmount}</span>
        <span className="ml-1">{txType === TxType.STAKE ? "AST" : "sAST"}</span>
      </span>
    </>
  );
};
