import { useAccount, useContractReads } from "wagmi";
import { ContractTypes } from "../config/ContractAddresses";
import { useContractAddresses } from "../config/hooks/useContractAddress";
import { astAbi } from "../contracts/astAbi";
import { stakingAbi } from "../contracts/stakingAbi";

export const useTokenBalances = () => {
  const { address, isConnected } = useAccount();
  const [sAstAddress, sAstTokenV4_deprecated] = useContractAddresses(
    [
      ContractTypes.AirSwapStaking_latest,
      ContractTypes.AirSwapV4Staking_deprecated,
    ],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

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

  const airSwapStakingV4OldContract = {
    address: sAstTokenV4_deprecated.address,
    chain: sAstTokenV4_deprecated.chainId,
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
      {
        ...airSwapStakingV4OldContract,
        functionName: "available",
        args: [address!],
      },
      {
        ...airSwapStakingV4OldContract,
        functionName: "balanceOf",
        args: [address!],
      },
    ],
    enabled: !!isConnected,
  });

  console.log(data);

  // available balance to unstake from latest contract
  const unstakableSastBalanceRaw = (data && (data[0].result as bigint)) || 0n;
  // total staked balance latest contract (not necessarily available to unstake)
  const sAstBalanceRaw = (data && (data[1].result as bigint)) || 0n;
  // AST balance unstaked
  const astBalanceRaw = (data && (data[2].result as bigint)) || 0n;
  // v4.0 balance available to unstake
  const unstakableSastBalanceV4_DeprecatedRaw =
    (data && (data[3].result as bigint)) || 0n;
  // v4.0 balance total (not necessarily ready to unstake)
  const sAstBalanceV4_DeprecatedRaw =
    (data && (data[4].result as bigint)) || 0n;

  return {
    unstakableSastBalanceRaw,
    sAstBalanceRaw,
    astBalanceRaw,
    unstakableSastBalanceV4_DeprecatedRaw,
    sAstBalanceV4_DeprecatedRaw,
  };
};
