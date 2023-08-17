import { FC } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";

interface NumberInputProps {
  astBalance: string;
  formMethods: UseFormReturn<FieldValues>;
}

const NumberInput: FC<NumberInputProps> = ({ astBalance, formMethods }) => {
  const { register, setValue } = formMethods;

  return (
    <input
      placeholder={astBalance}
      {...register("stakingAmount", {
        required: true,
        min: 0,
        max: astBalance,
        validate: (val: number) => val > 0,
        onChange: (e) => setValue("stakingAmount", e.target.value),
      })}
      className={twJoin("items-right w-1/5 bg-black text-right text-white")}
    />
  );
};

export default NumberInput;
