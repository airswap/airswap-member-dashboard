import { useChainId } from "wagmi";

export const useSnapshotConfig = () => {
  const chainId = useChainId();
  const endpoint =
    chainId === 5
      ? "https://testnet.snapshot.org/graphql"
      : "https://hub.snapshot.org/graphql";
  const space = chainId === 5 ? "airswap.eth" : "vote.airswap.eth";
  return {
    endpoint,
    space,
  };
};
