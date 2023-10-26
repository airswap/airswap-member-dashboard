import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";
import { parseUnits } from "viem";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { TxType } from "./types/StakingTypes";

export const NumberInput2 = ({
  formReturn,
}: {
  formReturn: UseFormReturn<FieldValues>;
}) => {
  const { txType } = useStakingModalStore();
  const { control, watch, getValues } = formReturn;
  watch();

  const {
    astBalanceRaw: astBalance,
    unstakableSastBalanceRaw: unstakableSAstBalance,
  } = useTokenBalances();

  console.log(getValues());

  return (
    <Controller
      control={control}
      name="stakingAmount"
      render={({ field: { onChange } }) => (
        <input
          max={
            txType === TxType.STAKE
              ? Number(astBalance)
              : Number(unstakableSAstBalance)
          }
          min={0}
          placeholder="0"
          autoComplete="off"
          onChange={(e) => {
            const bigIntValue = parseUnits(e.target.value, 4);
            onChange(bigIntValue);
          }}
          className={twJoin(
            "items-right w-1/5 bg-transparent text-right min-w-fit",
            "font-mono font-medium text-white text-[20px]",
            "focus-visible:outline-none",
          )}
        />
      )}
    />
  );
};

//       {...register("stakingAmount", {
//         valueAsNumber: true,
//         required: true,
//         min: 0,
//         max:
//           txType === TxType.STAKE
//             ? Number(astBalance)
//             : Number(unstakableSAstBalance),
//         validate: (val) => !isNaN(val) && val > 0,
//         onChange: (e) => {
//           // disallow non-numeric inputs
//           if (isNaN(e.target.value) && e.target.value !== ".") {
//             setValue("stakingAmount", "");
//           }
//           setValue("stakingAmount", e.target.value);
//         },
//       })}
