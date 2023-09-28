import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { TxType } from "./types/StakingTypes";

export const NumberInput = ({
  formReturn,
}: {
  formReturn: UseFormReturn<FieldValues>;
}) => {
  const { txType } = useStakingModalStore();
  const { register, setValue, watch } = formReturn;
  watch();
  const {
    astBalanceFormatted: astBalance,
    unstakableSAstBalanceFormatted: unstakableSAstBalance,
  } = useTokenBalances();

  const stake = txType === TxType.STAKE;
  const unstake = txType === TxType.UNSTAKE;

  return (
    <input
      max={astBalance}
      placeholder="0"
      autoComplete="off"
      {...register("stakingAmount", {
        valueAsNumber: true,
        required: true,
        min: 0,
        max: stake ? Number(astBalance) : Number(unstakableSAstBalance),
        validate: (val) => !isNaN(val) && val > 0,
        onChange: (e) => {
          // disallow non-numeric inputs
          if (isNaN(e.target.value) && e.target.value !== ".") {
            setValue("stakingAmount", "");
          }
          // if input is larger than max balance, reset to max balance
          if (stake && Number(e.target.value) > Number(astBalance)) {
            setValue("stakingAmount", astBalance.toString());
          } else if (
            unstake &&
            Number(e.target.value) > Number(unstakableSAstBalance)
          ) {
            setValue("stakingAmount", unstakableSAstBalance.toString());
          }
          // default setting
          setValue("stakingAmount", e.target.value);
        },
      })}
      className={twJoin(
        "items-right w-1/5 bg-transparent text-right min-w-fit",
        "font-mono font-medium text-white text-[20px]",
        "focus-visible:outline-none",
      )}
    />
  );
};
