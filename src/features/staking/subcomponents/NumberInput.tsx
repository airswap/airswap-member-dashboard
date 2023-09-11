import { FC, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";
import { StakeOrUnstake } from "../types/StakingTypes";

interface NumberInputProps {
  stakeOrUnstake: StakeOrUnstake;
  astBalance: string;
  unstakableSAstBalance: string;
  formReturn: UseFormReturn<FieldValues>;
  name: string;
}

export const NumberInput: FC<NumberInputProps> = ({
  stakeOrUnstake,
  astBalance,
  unstakableSAstBalance,
  formReturn,
  name,
}) => {
  const { register, setValue, getValues } = formReturn;
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const stakingAmount = getValues().stakingAmount;

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
          if (stakingAmount > 0 && stakingAmount <= 0.00001) {
            setValue(name, 0);
          } else {
            setValue(name, e.target.value);
          }
          if (stakeOrUnstake === StakeOrUnstake.STAKE) {
            +e.target.value > +astBalance
              ? setInsufficientBalance(true)
              : setInsufficientBalance(false);
          } else {
            +e.target.value > +unstakableSAstBalance
              ? setInsufficientBalance(true)
              : setInsufficientBalance(false);
          }
        },
      })}
      className={twJoin(
        "items-right w-1/5 bg-black text-right text-white min-w-fit",
        `${insufficientBalance ? "border-2 border-red-500" : "border-none"}`,
        `${
          insufficientBalance ? "border-2 focus:border-red-500" : "border-none"
        }`,
      )}
    />
  );
};
