import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { TxType } from "./types/StakingTypes";

export const NumberInput = ({
  formReturn,
  astBalance,
  unstakableSAstBalance,
}: {
  formReturn: UseFormReturn<FieldValues>;
  astBalance: number;
  unstakableSAstBalance: number;
}) => {
  const { txType } = useStakingModalStore();
  const { register, setValue, watch } = formReturn;
  watch();

  return (
    <input
      max={astBalance}
      placeholder="0"
      autoComplete="off"
      {...register("stakingAmount", {
        valueAsNumber: true,
        required: true,
        min: 0,
        max: txType === TxType.STAKE ? astBalance : unstakableSAstBalance,
        validate: (val) => !isNaN(val) && val > 0,
        onChange: (e) => {
          if (isNaN(e.target.value) && e.target.value !== ".") {
            setValue("stakingAmount", "");
          }
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
