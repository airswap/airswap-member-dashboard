import { FC } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";

interface NumberInputProps {
  astBalance: string;
  formReturn: UseFormReturn<FieldValues>;
  name: string;
}

export const NumberInput: FC<NumberInputProps> = ({
  astBalance,
  formReturn,
  name,
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
        max: astBalance,
        validate: (val) => typeof val === "number" && val > 0,
        onChange: (e) => {
          setValue(name, e.target.value);
        },
      })}
      // FIXME: monospace font per designs.
      className={twJoin(
        "items-right w-1/5 bg-transparent text-right text-white min-w-fit font-medium text-[20px]",
      )}
    />
  );
};
