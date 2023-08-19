import { useAccount, useBalance, useContractReads } from "wagmi";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { ContractTypes } from "../../../config/ContractAddresses";
import { stakingAbi } from "../../../contracts/stakingAbi";
import { astAbi } from "../../../contracts/astAbi";

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

  return {
    unstakableSAstBalance: (data && data[0].result) || 0,
    sAstBalance: (data && data[1].result) || 0,
    astBalance: (data && data[2].result) || 0,
  };
};
