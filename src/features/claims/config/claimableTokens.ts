import { Address } from "viem";

export type TestnetClaimableToken = {
  address: Address;
  mainnetEquivalentAddress: Address;
};

// NOTE: testnet tokens need a mainnet equivalent address in order to fetch
//       pricing data from defillama
type TestnetTokensNetworkMapping = {
  [index: number]: TestnetClaimableToken[];
};

export const testnetClaimableTokens: TestnetTokensNetworkMapping = {
  5: [
    // goerli
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

export const claimableTokens = {
  1: [
    // mainnet
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xD533a949740bb3306d119CC777fa900bA034cd52", // CRV
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
  ] as `0x${string}`[],
  56: [
    // bsc
    "0x55d398326f99059fF775485246999027B3197955", // BSC-USD
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // ETH
    "0xbA2aE424d960c26247Dd6c32edC70B295c744C43", // DOGE
    "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", // ADA
    "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402", // DOT
    "0x1CE0c2827e2eF14D5C4f29a091d735A204794041", // AVAX
  ] as `0x${string}`[],
  137: [
    // polygon
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC.e
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // DAI
  ] as `0x${string}`[],
  43114: [
    // avax
    "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", // USDC.e
    "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", // USDC
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", // wAVAX
    "0xc7198437980c041c805A1EDcbA50c1Ce5db95118", // USDT.e
  ] as `0x${string}`[],
} as const;
