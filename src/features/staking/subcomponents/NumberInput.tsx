import { FieldValues, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { StakeOrUnstake } from "../types/StakingTypes";

export const NumberInput = ({
  stakeOrUnstake,
  astBalance,
  unstakableSAstBalance,
  formReturn,
  name,
  isDisabled,
}: {
  stakeOrUnstake: StakeOrUnstake;
  astBalance: number;
  unstakableSAstBalance: number;
  formReturn: UseFormReturn<FieldValues>;
  name: string;
  isDisabled: boolean;
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
        validate: (val) => !isNaN(val) && val > 0,
        onChange: (e) => {
          if (isNaN(e.target.value) && e.target.value !== ".") {
            setValue(name, "");
          }

          setValue(name, e.target.value);
        },
      })}
      className={twMerge(
        "items-right w-1/4 bg-black text-right text-white",
        !isDisabled && "opacity-80",
      )}
      disabled={isDisabled}
    />
  );
};
