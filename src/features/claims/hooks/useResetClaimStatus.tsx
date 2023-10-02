import { useAccount, useQueryClient } from "wagmi";

export const useResetClaimStatus = (treeIds: `0x${string}`[] = []) => {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  return () =>
    treeIds.length &&
    queryClient.resetQueries({
      predicate: (query) => {
        if (Array.isArray(query.queryKey)) {
          return (
            query.queryKey[0].args?.[1] === address &&
            query.queryKey[0].functionName === "claimed" &&
            treeIds.includes(query.queryKey[0].args?.[0])
          );
        } else {
          return false;
        }
      },
    });
};
