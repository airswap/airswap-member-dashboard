import axios from "axios";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "viem";
import { useAccount, useQuery } from "wagmi";
import { generateMerkleLeaf } from "../../votes/utils/merkleUtils";
import { ACTIVATE_TREE_ID } from "../constants";

export type Claim = {
  tree: `0x${string}`;
  /**
   * NOTE: This is a number of points, it needs to be converted to a bigint
   * before it is sent to the contract.
   */
  value: number;
  proof: `0x${string}`[];
};

type LeavesFormat = [`0x${string}`, number][];

const getLeaves = async () => {
  const response = await axios.get<LeavesFormat>(
    import.meta.env.VITE_ACTIVATE_POINTS_LEAVES_URL!,
  );
  return response.data;
};

export const useActivatePointsClaim = () => {
  const { address: connectedAccount } = useAccount();

  const enabled = !!connectedAccount;

  const fetch = async () => {
    // Fetch the leaves from the JSON
    const leaves = await getLeaves();

    // Check if the user has any migrated points
    const points = leaves.find(
      ([address]) => address === connectedAccount,
    )?.[1];

    // Bail early if they have nothing to claim
    if (!points) return null;

    // Create a merkle tree
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
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
    enabled,
    cacheTime: 86_400_000, // 24 hours
    staleTime: 3_600_000, // 1 hour
  });
};
