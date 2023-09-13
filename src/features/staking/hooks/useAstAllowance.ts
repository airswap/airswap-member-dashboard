import { format } from "@greypixel_/nicenumbers";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";

export const useAstAllowance = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });
  const [airSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const { data: astAllowance } = useContractRead({
    address: airSwapToken.address,
    abi: astAbi,
    functionName: "allowance",
    args: [address!, airSwapStaking.address!],
    watch: true,
    chainId: chain?.id || 1,
    enabled: !!address && !!airSwapStaking.address,
  });

  const astAllowanceFormatted = format(astAllowance, { tokenDecimals: 4 });

  return { astAllowance, astAllowanceFormatted };
};
