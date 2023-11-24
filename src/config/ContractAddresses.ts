export enum ContractTypes {
  AirSwapToken,
  AirSwapStaking,
  AirSwapPool,
  AirSwapV3Staking_deprecated,
}

type ContractList = { [k in ContractTypes]?: `0x${string}` };

export const contractAddressesByChain: Record<number, ContractList> = {
  1: {
    [ContractTypes.AirSwapToken]: "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
    [ContractTypes.AirSwapStaking]:
      "0x9fc450F9AfE2833Eb44f9A1369Ab3678D3929860",
    [ContractTypes.AirSwapV3Staking_deprecated]:
      "0x6d88B09805b90dad911E5C5A512eEDd984D6860B",
    [ContractTypes.AirSwapPool]: "0xbbcec987e4c189fcbab0a2534c77b3ba89229f11",
  },
  5: {
    // goerli
    [ContractTypes.AirSwapToken]: "0x1a1ec25DC08e98e5E93F1104B5e5cdD298707d31",
    [ContractTypes.AirSwapStaking]:
      "0x51F372bE64F0612532F28142cECF8F204B272622",
    [ContractTypes.AirSwapPool]: "0xbbcec987e4c189fcbab0a2534c77b3ba89229f11",
  },
  56: {
    // bsc
    [ContractTypes.AirSwapPool]: "0xbbcec987e4c189fcbab0a2534c77b3ba89229f11",
  },
  137: {
    // polygon
    [ContractTypes.AirSwapPool]: "0xbbcec987e4c189fcbab0a2534c77b3ba89229f11",
  },
  43114: {
    // avax
    [ContractTypes.AirSwapPool]: "0xbbcec987e4c189fcbab0a2534c77b3ba89229f11",
  },
};
