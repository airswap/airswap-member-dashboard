import { Address } from "viem";
import { ChainId } from "../types/StakingTypes";

export const etherscanLink = (
  chainId: number | undefined,
  transactionHash: Address | undefined,
) => {
  const chainUrls: { [key in ChainId]: string } = {
    [ChainId.Mainnet]: "https://etherscan.io/tx/",
    [ChainId.Sepolia]: "https://sepolia.etherscan.io/tx/",
  };

  return `${chainUrls[(chainId as ChainId) || 1]}${transactionHash}`;
};
