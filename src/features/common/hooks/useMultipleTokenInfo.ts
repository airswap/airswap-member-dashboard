import { useQueries } from "@tanstack/react-query";
import { erc20ABI } from "wagmi";
import { multicall } from "wagmi/actions";

type TokenInfoQueryKey = [
  chainId: number,
  tokenAddress: `0x${string}`,
  "tokenInfo",
];

const fetchTokenInfo = async ({
  queryKey: [chainId, tokenAddress],
}: {
  queryKey: TokenInfoQueryKey;
}) => {
  const results = await multicall({
    chainId,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "decimals",
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "symbol",
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "name",
      },
    ],
  });

  return {
    address: tokenAddress,
    decimals: results[0].result,
    symbol: results[1].result,
    name: results[2].result,
  };
};

export const useMultipleTokenInfo = ({
  chainId,
  tokenAddresses,
}: {
  tokenAddresses?: `0x${string}`[];
  chainId?: number;
}) => {
  const enabled =
    chainId != null && tokenAddresses != null && tokenAddresses.length > 0;
  const queries = useQueries({
    queries: tokenAddresses!.map((tokenAddress) => ({
      queryKey: [chainId, tokenAddress, "tokenInfo"] as TokenInfoQueryKey,
      queryFn: fetchTokenInfo,
      enabled,
      cacheTime: 2_592_000_000, // 1 month
      staleTime: Infinity, // doesn't change
    })),
  });

  return queries;
};
