import { format } from "@greypixel_/nicenumbers";
import { useAccount, useContractRead } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";

export const useAstAllowance = () => {
  const { address } = useAccount();
  const [AirSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });
  const [AirSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const { data: astAllowance } = useContractRead({
    address: AirSwapToken.address,
    abi: astAbi,
    functionName: "allowance",
    args: [address as `0x${string}`, AirSwapStaking.address as `0x${string}`],
    watch: true,
    staleTime: 300_000, // 5 minutes,
  });

  const astAllowanceFormatted = format(astAllowance, { tokenDecimals: 4 });

  return { astAllowance, astAllowanceFormatted };
};
