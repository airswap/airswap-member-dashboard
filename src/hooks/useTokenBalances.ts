import { useAccount, useContractReads } from "wagmi";
import { useContractAddresses } from "../config/hooks/useContractAddress";
import { ContractTypes } from "../config/ContractAddresses";
import { stakingAbi } from "../contracts/stakingAbi";
import { astAbi } from "../contracts/astAbi";
import { format } from "@greypixel_/nicenumbers";

export const useTokenBalances = () => {
  const { address, isConnected } = useAccount();
  const [sAstAddress] = useContractAddresses([ContractTypes.AirSwapStaking], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  const [AirSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });
  const airSwapTokenContract = {
    address: AirSwapToken.address,
    chain: AirSwapToken.chainId,
    abi: astAbi,
  };

  const airSwapStakingContract = {
    address: sAstAddress.address,
    chain: sAstAddress.chainId,
    abi: stakingAbi,
  };

  const { data } = useContractReads({
    contracts: [
      {
        ...airSwapStakingContract,
        functionName: "available",
        args: [address as `0x${string}`],
      },
      {
        ...airSwapStakingContract,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        ...airSwapTokenContract,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
    ],
    enabled: !!isConnected,
  });

  const unstakableSAstBalanceRaw = (data && data[0].result) || 0;
  const sAstBalanceRaw = (data && data[1].result) || 0;
  const astBalanceRaw = (data && data[2].result) || 0;

  const ustakableSAstBalanceFormatted =
    format((data && data[0].result) || 0, { tokenDecimals: 4 }) || 0;
  const sAstBalanceFormatted =
    format(data && data[1].result, { tokenDecimals: 4 }) || 0;

  const astBalanceFormatted =
    format(data && data[2].result, { tokenDecimals: 4 }) || 0;

  return {
    unstakableSAstBalanceRaw,
    ustakableSAstBalanceFormatted,
    sAstBalanceRaw,
    sAstBalanceFormatted,
    astBalanceRaw,
    astBalanceFormatted,
  };
};
