import { useNetwork } from "wagmi";

export const useIsSupportedChain = () => {
  const { chain } = useNetwork();
  return chain?.id === 1 || chain?.id === 5;
};
