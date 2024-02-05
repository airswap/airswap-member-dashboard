export enum ContractTypes {
  AirSwapToken,
  AirSwapStaking_latest,
  AirSwapPool,
  AirSwapV3Staking_deprecated,
  AirSwapV4Staking_deprecated,
}

type ContractList = { [k in ContractTypes]?: `0x${string}` };

export const contractAddressesByChain: Record<number, ContractList> = {
  1: {
    [ContractTypes.AirSwapToken]: "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
    [ContractTypes.AirSwapStaking_latest]:
      // TODO: update contract with mainnet address when deployed
      "0x9fc450F9AfE2833Eb44f9A1369Ab3678D3929860",
    [ContractTypes.AirSwapV3Staking_deprecated]:
      "0x6d88B09805b90dad911E5C5A512eEDd984D6860B",
    [ContractTypes.AirSwapV4Staking_deprecated]:
      "0x9fc450F9AfE2833Eb44f9A1369Ab3678D3929860",
    [ContractTypes.AirSwapPool]: "0xbbcec987e4c189fcbab0a2534c77b3ba89229f11",
  },
  5: {
    // goerli
    [ContractTypes.AirSwapToken]: "0x4092D6DBA9abB7450B9d91aA7ED2712935D63b39",
    [ContractTypes.AirSwapV3Staking_deprecated]:
      "0xd913469D9FCdB84a6a8fF049765e99f4C9146B4F",
    [ContractTypes.AirSwapV4Staking_deprecated]:
      "0x20aaebad8c7c6ffb6fdaa5a622c399561562beea",
    [ContractTypes.AirSwapStaking_latest]:
      "0xaCfd509f5785E57257B2eAc3AE4Ef080074d37c3",
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
  111555111: {
    // sepolia
    [ContractTypes.AirSwapStaking_latest]:
      "0x147644781C1ccb078738ecced7B247AF0bD5Aa8b",
  },
};
