import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";
import AirSwapLogo from "../../assets/airswap-logo.svg";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { LineBreak } from "../common/LineBreak";
import { NumberInput } from "./NumberInput";
import { StakableBar } from "./StakableBar";
import { TxType, useStakingModalStore } from "./store/useStakingModalStore";

export const ManageStake = ({
  formReturn,
}: {
  formReturn: UseFormReturn<FieldValues>;
}) => {
  const { txType, setTxType } = useStakingModalStore();
  const { getValues } = formReturn;
  const stakingAmount = getValues().stakingAmount;

  const {
    astBalanceFormatted: astBalance,
    ustakableSAstBalanceFormatted: unstakableSAstBalance,
  } = useTokenBalances();

  return (
    <div>
      <StakableBar className="my-6" />
      <LineBreak className="relative mb-4 -mx-6" />
      <div className="font-lg pointer-cursor rounded-md font-semibold">
        <Button
          className={twJoin([
            "w-1/2 p-2",
            `${txType === "stake" ? "bg-gray-800" : "text-gray-500"}`,
          ])}
          rounded="leftFalse"
          size="small"
          onClick={() => setTxType(TxType.STAKE)}
        >
          Stake
        </Button>
        <Button
          className={twJoin(
            "w-1/2 p-2",
            `${txType === "unstake" ? "bg-gray-800" : "text-gray-500"}`,
          )}
          rounded="rightFalse"
          size="small"
          color="transparent"
          onClick={() => setTxType(TxType.UNSTAKE)}
          disabled={stakingAmount <= 0}
        >
          Unstake
        </Button>
      </div>
      <div
        className={twJoin(
          "my-3 rounded px-4 py-3 text-xs leading-[18px]",
          "bg-gray-800 text-gray-400",
        )}
      >
        Stake AST prior to voting on proposals. The amount of tokens you stake
        determines the weight of your vote. Tokens unlock linearly over 20
        weeks.
      </div>
      <div className="flex items-center justify-between rounded border border-gray-800 bg-gray-950 px-5 py-3">
        <img src={AirSwapLogo} alt="AirSwap Logo" className="h-8 w-8" />
        <div className="flex flex-col items-end uppercase w-full overflow-hidden">
          <div>
            <NumberInput
              astBalance={+astBalance}
              unstakableSAstBalance={+unstakableSAstBalance}
              formReturn={formReturn}
            />
          </div>
          <span className="text-xs font-medium leading-4 text-gray-500">
            {txType === TxType.STAKE ? astBalance : unstakableSAstBalance}{" "}
            {txType === TxType.STAKE ? "stakable" : "unstakable"}
          </span>
        </div>
      </div>
    </div>
  );
};
