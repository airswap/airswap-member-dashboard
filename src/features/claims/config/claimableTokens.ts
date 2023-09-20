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
  // TODO: populate.
  mainnet: [],
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
