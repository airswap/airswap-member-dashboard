import { useAccount, useQueryClient } from "wagmi";

export const useResetClaimStatus = (proposalIds: `0x${string}`[] = []) => {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  return () =>
    proposalIds.length &&
    queryClient.resetQueries({
      predicate: (query) => {
        if (Array.isArray(query.queryKey)) {
          return (
            query.queryKey[0].args?.[1] === address &&
            query.queryKey[0].functionName === "claimed" &&
            proposalIds.includes(query.queryKey[0].args?.[0])
          );
        } else {
          return false;
        }
      },
    });
};
