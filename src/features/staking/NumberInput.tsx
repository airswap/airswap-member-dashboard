import { TxType, useStakingModalStore } from "./store/useStakingModalStore";

export const NumberInput = ({
  astBalance,
  unstakableSAstBalance,
  name,
}: {
  astBalance: number;
  unstakableSAstBalance: number;
  name: string;
}) => {
  const { formReturn, txType } = useStakingModalStore();
  const { register, setValue } = formReturn;

  return (
    <input
      max={astBalance}
      placeholder="0"
      defaultValue="0"
      {...register("stakingAmount", {
        valueAsNumber: true,
        required: true,
        min: 0,
        max: txType === TxType.STAKE ? astBalance : unstakableSAstBalance,
        validate: (val) => !isNaN(val) && val > 0,
        onChange: (e) => {
          if (isNaN(e.target.value) && e.target.value !== ".") {
            setValue(name, "");
          }

          setValue(name, e.target.value);
        },
      })}
      // FIXME: monospace font per designs.
      className="items-right w-1/5 bg-transparent text-right text-white min-w-fit font-medium text-[20px]"
    />
  );
};
