export const etherscanLink = (
  chainId: number,
  transactionHash: string | undefined,
) => {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/tx/${transactionHash}`;
    case 5:
      return `https://goerli.etherscan.io/tx/${transactionHash}`;
  }
};
