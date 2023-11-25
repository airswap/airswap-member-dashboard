import { fetchBalance, multicall } from "wagmi/actions";
import { splitsAbi } from "../contracts/splitsAbi";
import { useContractAddresses } from "../config/hooks/useContractAddress";
import { ContractTypes } from "../config/ContractAddresses";
import { useQueries } from "@tanstack/react-query";


type SplitsBalancesQueryKey = [
  chainId: number,
  tokenAddress: `0x${string}`,
  splitsMainAddress: `0x${string}`,
  airSwapPoolAddress: `0x${string}`,
  splitsBalances: "splitsBalances",
];

const splitWallets: Record<number, `0x${string}`> = {
  1: "0xaD30f7EEBD9Bd5150a256F47DA41d4403033CdF0"
}

const fetchSplitsBalances = async ({
  queryKey: [chainId, tokenAddress, splitsMainAddress, airSwapPoolAddress],
}: {
  queryKey: SplitsBalancesQueryKey;
}) => {
  const claimable = await fetchBalance({ address: airSwapPoolAddress, token: tokenAddress, chainId });
  const splitWallet = splitWallets[chainId];
  if (splitWallet) {
    const results = await multicall({
      chainId,
      contracts: [
        {
          address: splitsMainAddress,
          abi: splitsAbi,
          functionName: "getERC20Balance",
          args: ["0xaD30f7EEBD9Bd5150a256F47DA41d4403033CdF0", tokenAddress],
        },
        {
          address: splitsMainAddress,
          abi: splitsAbi,
          functionName: "getERC20Balance",
          args: [airSwapPoolAddress, tokenAddress],
        }
      ],
    });
  
  
  
    return {
      address: tokenAddress,
      toDistribute: results[0].result,
      toWithdraw: results[1].result,
      claimable: claimable.value
    };
  }
  else {
    return {
      address: tokenAddress,
      toDistribute: 0n,
      toWithdraw: 0n,
      claimable: claimable.value
    };
  }
};

export const useSplitsBalances = ({
  chainId,
  tokenAddresses,
}: {
  tokenAddresses?: `0x${string}`[];
  chainId?: number;
}) => {
  const [splitsMain, airSwapPool] = useContractAddresses(
    [ContractTypes.SplitsMain, ContractTypes.AirSwapPool],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const queries = useQueries({
    queries: tokenAddresses!.map((tokenAddress) => ({
      queryKey: [chainId, tokenAddress, splitsMain.address!, airSwapPool.address!, "splitsBalances"] as SplitsBalancesQueryKey,
      queryFn: fetchSplitsBalances,
      cacheTime: 2_592_000_000, // 1 month
    })),
  });

  return queries;

}