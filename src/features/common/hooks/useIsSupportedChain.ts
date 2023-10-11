import { useNetwork } from "wagmi";
import { contractAddressesByChain } from "../../../config/ContractAddresses";

const supportedChains = Object.keys(contractAddressesByChain).map((chainId) =>
  parseInt(chainId),
);
export const useIsSupportedChain = () => {
  const { chain } = useNetwork();
  return chain && supportedChains.includes(chain.id);
};
