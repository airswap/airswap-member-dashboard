import { ChainId } from "../types/StakingTypes";

export const etherscanLink = (
  chainId: number | undefined,
  transactionHash: `0x${string}` | undefined,
) => {
  const chainUrls: { [key in ChainId]: string } = {
    [ChainId.Mainnet]: "https://etherscan.io/tx/",
    [ChainId.Goerli]: "https://goerli.etherscan.io/tx/",
  };

  return `${chainUrls[(chainId as ChainId) || 1]}${transactionHash}`;
};
