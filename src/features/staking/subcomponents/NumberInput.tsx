import { FC } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { StakeOrUnstake } from "../types/StakingTypes";

interface NumberInputProps {
  stakeOrUnstake: StakeOrUnstake;
  astBalance: string;
  unstakableSAstBalance: string;
  formReturn: UseFormReturn<FieldValues>;
  name: string;
  isDisabled: boolean;
}

export const NumberInput: FC<NumberInputProps> = ({
  stakeOrUnstake,
  astBalance,
  unstakableSAstBalance,
  formReturn,
  name,
  isDisabled,
}) => {
  const { register, setValue } = formReturn;

  return (
    <input
      max={astBalance}
      placeholder="0"
      {...register("stakingAmount", {
        valueAsNumber: true,
        required: true,
        min: 0,
        max:
          stakeOrUnstake === StakeOrUnstake.STAKE
            ? astBalance
            : unstakableSAstBalance,
        validate: (val) => typeof val === "number" && val > 0,
        onChange: (e) => {
          setValue(name, e.target.value);
        },
      })}
      className={twMerge(
        "items-right w-1/4 bg-black text-right text-white",
        `${!isDisabled && `opacity-80`}`,
      )}
      // Input should be disabled if a transaction is loading
      disabled={isDisabled}
    />
  );
};
