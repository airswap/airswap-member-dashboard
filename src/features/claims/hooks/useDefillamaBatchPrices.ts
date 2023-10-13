import axios from "axios";
import { useQuery } from "wagmi";
import { claimableTokens } from "../config/claimableTokens";

// This type helps by throwing errors if we don't specify a name for a chain added in claimableTokens
export type SupportedChainId = keyof typeof claimableTokens;

const DefillamaChainNames: Record<SupportedChainId, string> = {
  1: "ethereum",
  56: "bsc",
  137: "polygon",
  43114: "avax",
};

const path = "https://coins.llama.fi/prices/current";

type CoinPrice = {
  decimals: number;
  price: number;
  symbol: string;
  /** unix */
  timestamp: number;
};

type CurrentPricesResponse = {
  coins: Record<string, CoinPrice>;
};

const fetch = async (chainName: string, addresses: `0x${string}`[]) => {
  const response = await axios.get<CurrentPricesResponse>(
    `${path}/${addresses
      .map((address) => `${chainName}:${address}`)
      .join(",")}`,
  );
  const results = response.data.coins;
  // return an array of {address: price} objects, where `price` is results[address].price
  return addresses.map((address) => ({
    address,
    price: results[`${chainName}:${address}`].price,
  }));
};

export const useDefiLlamaBatchPrices = ({
  chainId,
  tokenAddresses,
}: {
  chainId: SupportedChainId;
  tokenAddresses: `0x${string}`[];
}) => {
  return useQuery(
    ["defillama", "prices", chainId, tokenAddresses],
    () => fetch(DefillamaChainNames[chainId], tokenAddresses),
    {
      cacheTime: 3_600_000, // 1 hour
      staleTime: 30_000, // 30 seconds
      refetchInterval: 60_000, // 60 seconds
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      enabled: !!tokenAddresses && tokenAddresses.length > 0,
    },
  );
};
