import { mainnet, bsc, avalanche, polygon, sepolia } from "wagmi/chains";

export const providerUrlsByChain: Record<number, string> = {
  [mainnet.id]: "https://ethereum-rpc.publicnode.com",
  [bsc.id]: "https://bsc-dataseed.binance.org",
  [polygon.id]: "https://polygon-rpc.com",
  [avalanche.id]: "https://api.avax.network/ext/bc/C/rpc",
  [sepolia.id]: "https://ethereum-sepolia-rpc.publicnode.com",
};
