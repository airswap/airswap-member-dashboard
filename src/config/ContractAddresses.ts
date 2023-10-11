export enum ContractTypes {
  AirSwapToken,
  AirSwapStaking,
  AirSwapPool,
}

type ContractList = { [k in ContractTypes]?: `0x${string}` };

export const contractAddressesByChain: Record<number, ContractList> = {
  1: {
    [ContractTypes.AirSwapToken]: "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
    [ContractTypes.AirSwapStaking]:
      "0x9fc450F9AfE2833Eb44f9A1369Ab3678D3929860",
    [ContractTypes.AirSwapPool]: "0xEEcD248D977Fd4D392915b4AdeF8154BA3aE9c02",
  },
  43114: {
    // avax
    [ContractTypes.AirSwapPool]: "0xEEcD248D977Fd4D392915b4AdeF8154BA3aE9c02",
  },
  5: {
    [ContractTypes.AirSwapToken]: "0x1a1ec25DC08e98e5E93F1104B5e5cdD298707d31",
    [ContractTypes.AirSwapStaking]:
      "0x51F372bE64F0612532F28142cECF8F204B272622",
    [ContractTypes.AirSwapPool]: "0xEEcD248D977Fd4D392915b4AdeF8154BA3aE9c02",
  },
};
