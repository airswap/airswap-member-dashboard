import { useQuery, useQueryClient } from "wagmi";
import { generateMerkleLeaf } from "../utils/merkleUtils";
import { useGroupMerkleTree } from "./useGroupMerkleTree";

export const useGroupMerkleProof = ({
  proposalIds,
  vote,
  enabled,
}: {
  proposalIds: string[];
  vote: {
    voter: `0x${string}`;
    vp: number;
  };
  enabled?: boolean;
}) => {
  const queryKey = ["group-merkle-proof", proposalIds, vote.voter, vote.vp];
  const queryClient = useQueryClient();
  // Prevent fetching the merkle tree (lots of data) if we already have the root.
  const cachedProof = queryClient.getQueryData(queryKey);

  const tree = useGroupMerkleTree(proposalIds, {
    enabled: !cachedProof && (enabled ?? true),
  });

  return useQuery(
    queryKey,
    () => {
      const leaf = generateMerkleLeaf({ voter: vote.voter, vp: vote.vp });
      return tree!.getHexProof(leaf) as `0x${string}`[];
    },
    {
      enabled: (enabled ?? true) && !!tree,
      cacheTime: 5_184_000_000, // 2 months.
      staleTime: Infinity, // doesn't change
    },
  );
};
