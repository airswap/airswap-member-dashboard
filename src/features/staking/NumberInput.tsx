import { useState } from "react";
import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import { parseUnits } from "viem";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { TxType } from "./types/StakingTypes";

export const NumberInput = ({
  formReturn,
}: {
  formReturn: UseFormReturn<FieldValues>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const { txType } = useStakingModalStore();
  const { control, watch } = formReturn;
  watch();

  const {
    astBalanceRaw: astBalance,
    unstakableSastBalanceRaw: unstakableSAstBalance,
  } = useTokenBalances();

  const pattern = /^(0|[1-9]\d*)(\.\d+)?$/;

  return (
    <Controller
      control={control}
      name="stakingAmount"
      rules={{
        validate: (e) => !isNaN(e),
        pattern: pattern,
        min: 0,
        max:
          txType === TxType.STAKE
            ? Number(astBalance)
            : Number(unstakableSAstBalance),
      }}
      render={({ field: { onChange, value } }) => (
        <input
          placeholder="0"
          autoComplete="off"
          onChange={(e) => {
            const input = e.target.value;
            if (!pattern.test(input)) {
              onChange("");
            } else {
              const bigIntValue = parseUnits(input, 4);
              onChange(bigIntValue);
            }
          }}
          className="items-right w-1/5 bg-transparent text-right min-w-fit font-mono font-medium text-white text-[20px] focus-visible:outline-none"
        />
      )}
    />
  );
};
