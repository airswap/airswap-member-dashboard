type ContractAddress = { [key: number]: { [key: string]: string } };

export const contractAddresses: ContractAddress = {
  1: {
    ast: "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
    staking: "0x9fc450F9AfE2833Eb44f9A1369Ab3678D3929860",
    pool: "0xe2E7AE67E7ee6d4D90dfef945aB6dE6A14dB4c17",
  },
  5: {
    ast: "0x1a1ec25DC08e98e5E93F1104B5e5cdD298707d31",
    staking: "0x51F372bE64F0612532F28142cECF8F204B272622",
    pool: "0x62069Ff3b5127742B0D86b5fF5C6c21cF5e44154",
  },
};

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
