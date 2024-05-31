import axios from "axios";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "viem";
import { useAccount, useQuery } from "wagmi";
import { generateMerkleLeaf } from "../../votes/utils/merkleUtils";
import { ACTIVATE_TREE_ID } from "../constants";

type LeavesFormat = [`0x${string}`, number][];

const getLeaves = async () => {
  const response = await axios.get<LeavesFormat>(
    import.meta.env.VITE_ACTIVATE_POINTS_LEAVES_URL!,
  );
  return response.data;
};

export const useActivatePointsClaim = ({ enabled }: { enabled: boolean }) => {
  const { address: connectedAccount } = useAccount();

  const _enabled = !!connectedAccount && (enabled ?? true);

  const fetch = async () => {
    // Fetch the leaves from the JSON
    const leaves = await getLeaves();

    // Check if the user has any migrated points
    const points = leaves.find(
      ([address]) => address.toLowerCase() === connectedAccount!.toLowerCase(),
    )?.[1];

    // Bail early if they have nothing to claim
    if (!points) return null;

    // Create a merkle tree
    const merkleTree = new MerkleTree(
      leaves.map(([addr, points]) =>
        generateMerkleLeaf({
          voter: addr,
          vp: points,
        }),
      ),
      keccak256,
      { sort: true },
    );
    // Generate their leaf
    const userLeaf = generateMerkleLeaf({
      voter: connectedAccount!,
      vp: points,
    });
    // Generate their proof
    const proof = merkleTree.getHexProof(userLeaf) as `0x${string}`[];

    return {
      tree: ACTIVATE_TREE_ID,
      value: points,
      proof,
    };
  };

  return useQuery(["activate-points-claim", connectedAccount], fetch, {
    enabled: _enabled,
    cacheTime: 86_400_000, // 24 hours
    staleTime: 3_600_000, // 1 hour
  });
};
