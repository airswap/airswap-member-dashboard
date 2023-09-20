import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";
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
      // FIXME: monospace font per designs.
      className={twJoin(
        "items-right w-1/5 bg-transparent text-right text-white min-w-fit font-medium text-[20px]",
      )}
      disabled={isDisabled}
    />
  );
};
