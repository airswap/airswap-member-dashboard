import { useNetwork } from "wagmi";
import { ContractTypes, contractAddressesByChain } from "../ContractAddresses";

/**
 * Gets the contract address for particular contract type(s).

 * @returns An array of contract addresses, or undefined if the contract type
 * is not found for the given chain.
 */
export const useContractAddresses = (
  contractTypes: ContractTypes[],
  {
    defaultChainId = 1,
    alwaysUseDefault = false,
    useDefaultAsFallback = false,
  }: {
    /** DefaultChainId, used when no wallet is connected or when `alwaysUseDefault` is true */
    defaultChainId?: number;
    /** Flag to always use the same chain */
    alwaysUseDefault?: boolean;
    /** Flag to use the default chain if no deployment exists for the currently selected chain */
    useDefaultAsFallback?: boolean;
  },
) => {
  const { chain } = useNetwork();

  return contractTypes.map((type) => {
    // Use default when no wallet is connected or when `alwaysUseDefault` is true
    let _chainId =
      (alwaysUseDefault ? defaultChainId : chain?.id) || defaultChainId;
    let _contractAddress = contractAddressesByChain[_chainId]?.[type];

    // Fallback if no deploy & weren't already default & fallback flag is set.
    if (
      !_contractAddress &&
      _chainId !== defaultChainId &&
      useDefaultAsFallback
    ) {
      _chainId = defaultChainId;
      _contractAddress = contractAddressesByChain[defaultChainId]?.[type];
    }

    return {
      chainId: _chainId,
      address: _contractAddress,
    };
  });
};
