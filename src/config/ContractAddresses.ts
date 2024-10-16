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
      "0x8Bf384296A009723435aD5E8203DA5736b895038",
    [ContractTypes.AirSwapV3Staking_deprecated]:
      "0x6d88B09805b90dad911E5C5A512eEDd984D6860B",
    [ContractTypes.AirSwapV4Staking_deprecated]:
      "0x9fc450F9AfE2833Eb44f9A1369Ab3678D3929860",
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
  17000: {
    // holesky
    [ContractTypes.AirSwapStaking_latest]:
      "0x8Bf384296A009723435aD5E8203DA5736b895038",
  },
  43114: {
    // avax
    [ContractTypes.AirSwapPool]: "0xbbcec987e4c189fcbab0a2534c77b3ba89229f11",
  },
  11155111: {
    // sepolia
    [ContractTypes.AirSwapStaking_latest]:
      "0x8Bf384296A009723435aD5E8203DA5736b895038",
    [ContractTypes.AirSwapToken]: "0x4092D6DBA9abB7450B9d91aA7ED2712935D63b39",
  },
};
