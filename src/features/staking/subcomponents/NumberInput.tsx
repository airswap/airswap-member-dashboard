import { FC } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";

interface NumberInputProps {
  astBalance: string;
  formMethods: UseFormReturn<FieldValues>;
  name: string;
}

export const NumberInput: FC<NumberInputProps> = ({
  astBalance,
  formMethods,
  name,
}) => {
  const { register, setValue } = formMethods;

  return (
    <input
      type="number"
      step={1}
      min={0}
      max={astBalance}
      placeholder="0"
      {...register("stakingAmount", {
        required: true,
        min: 0,
        max: astBalance,
        validate: (val: number) => val > 0,
        onChange: (e) => {
          setValue(name, e.target.value);
        },
      })}
      className={twJoin(
        "items-right w-1/5 bg-black text-right text-white min-w-fit",
        "appearance-none",
      )}
      style={{
        MozAppearance: "textfield",
        margin: 0,
      }}
    />
  );
};
