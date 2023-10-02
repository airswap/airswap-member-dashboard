type MainnetClaimableToken = {
  address: `0x${string}`;
  mainnetEquivalentAddress?: undefined;
};

type TestnetClaimableToken = {
  address: `0x${string}`;
  mainnetEquivalentAddress: `0x${string}`;
};
type ClaimableTokensNetworkMapping = {
  [index: number]: TestnetClaimableToken[];
} & {
  mainnet: MainnetClaimableToken[];
};

export const claimableTokens: ClaimableTokensNetworkMapping = {
  mainnet: (
    [
      "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // CRV
      "0x92D6C1e31e14520e676a687F0a93788B716BEff5", // DYDX
      "0xc944E90C64B2c07662A292be6244BDf05Cda44a7", // GRT
      "0x4E15361FD6b4BB609Fa63C81A2be19d873717870", // FTM
      "0xd1d2Eb1B1e90B638588728b4130137D262C87cae", // GALA
      "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
      "0x4Fabb145d64652a948d72533023f6E7A623C7C53", // BUSD
      "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
      "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", // MATIC
      "0x0000000000085d4780B73119b644AE5ecd22b376", // TUSD
      "0x3845badAde8e6dFF049820680d1F14bD3903a5d0", // SAND
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
      "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // AAVE
      "0x4d224452801ACEd8B2F0aebE155379bb5D594381", // APE
      "0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF", // IMX
      "0x8E870D67F660D95d5be530380D0eC0bd388289E1", // USDP
    ] as `0x${string}`[]
  ).map((address) => ({ address })),
  5: [
    // link
    {
      address: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
      mainnetEquivalentAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    // uni
    {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      mainnetEquivalentAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
    // weth
    {
      address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      mainnetEquivalentAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  ],
};
