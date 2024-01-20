import BigNumber from "bignumber.js";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { stakingAbi } from "../../../contracts/stakingAbi";

export const useStakeAst = ({
  stakingAmountFormatted,
  enabled = true,
}: {
  stakingAmountFormatted: number;
  enabled?: boolean;
}) => {
  const [airSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking_latest],
    {
      defaultChainId: 1,
      useDefaultAsFallback: false,
    },
  );

  const stakingAmountConversion = new BigNumber(stakingAmountFormatted)
    .multipliedBy(10 ** 4)
    .integerValue()
    .toString();

  const { config: configStake } = usePrepareContractWrite({
    address: airSwapStaking.address,
    abi: stakingAbi,
    functionName: "stake",
    args: [BigInt(stakingAmountConversion)],
    enabled: enabled,
  });

  return useContractWrite(configStake);
};
