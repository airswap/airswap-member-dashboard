import axios from "axios";
import { useQuery } from "wagmi";

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

const fetch = async (addresses: `0x${string}`[]) => {
  const response = await axios.get<CurrentPricesResponse>(
    `${path}/${addresses.map((address) => `ethereum:${address}`).join(",")}`,
  );
  const results = response.data.coins;
  // return an array of {address: price} objects, where `price` is results[address].price
  console.log(results);
  return addresses.map((address) => ({
    address,
    price: results[`ethereum:${address}`].price,
  }));
};

export const useDefiLlamaBatchPrices = (addresses: `0x${string}`[]) => {
  return useQuery(
    ["defillama", "prices", 1, addresses],
    () => fetch(addresses),
    {
      cacheTime: 3_600_000, // 1 hour
      staleTime: 30_000, // 30 seconds
      refetchInterval: 60_000, // 60 seconds
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      enabled: !!addresses && addresses.length > 0,
    },
  );
};
