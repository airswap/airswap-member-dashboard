import { useNetwork } from "wagmi";

export const useChainSupportsStaking = () => {
  const { chain } = useNetwork();
  return chain?.id === 1 || chain?.id === 11155111;
};
