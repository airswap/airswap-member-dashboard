import { useChainId } from "wagmi";

export const useSnapshotConfig = () => {
  const chainId = useChainId();
  const endpoint =
    chainId === 5
      ? "https://testnet.snapshot.org/graphql"
      : "https://hub.snapshot.org/graphql";
  const startTimestamp = chainId === 5 ? 1690930800 : 1693609200;
  const space = chainId === 5 ? "airswap.eth" : "vote.airswap.eth";
  return {
    endpoint,
    space,
    startTimestamp,
  };
};
