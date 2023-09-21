import { format } from "@greypixel_/nicenumbers";
import { useAccount, useContractReads } from "wagmi";
import { ContractTypes } from "../config/ContractAddresses";
import { useContractAddresses } from "../config/hooks/useContractAddress";
import { astAbi } from "../contracts/astAbi";
import { stakingAbi } from "../contracts/stakingAbi";

export const useTokenBalances = () => {
  const { address, isConnected } = useAccount();
  const [sAstAddress] = useContractAddresses([ContractTypes.AirSwapStaking], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });
  const airSwapTokenContract = {
    address: airSwapToken.address,
    chain: airSwapToken.chainId,
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
        args: [address!],
      },
      {
        ...airSwapStakingContract,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        ...airSwapTokenContract,
        functionName: "balanceOf",
        args: [address!],
      },
    ],
    enabled: !!isConnected,
  });

  const unstakableSAstBalanceRaw = Number(data && data[0].result) || 0;
  const sAstBalanceRaw = Number(data && data[1].result) || 0;
  const astBalanceRaw = Number(data && data[2].result) || 0;

  const unstakableSAstBalanceFormatted =
    format((data && data[0].result) || 0, { tokenDecimals: 4 }) || 0;
  const sAstBalanceFormatted =
    format(data && data[1].result, { tokenDecimals: 4 }) || 0;

  const astBalanceFormatted =
    format(data && data[2].result, { tokenDecimals: 4 }) || 0;

  return {
    unstakableSAstBalanceRaw,
    unstakableSAstBalanceFormatted,
    sAstBalanceRaw,
    sAstBalanceFormatted,
    astBalanceRaw,
    astBalanceFormatted,
  };
};
