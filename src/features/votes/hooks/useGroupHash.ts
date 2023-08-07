import { useMemo } from "react";
import { encodePacked, keccak256 } from "viem";
import { Proposal } from "./useGroupedProposals";

/** Hashes groupIds used as keys for roots & claims */
export const useGroupHash = (proposalGroup: Proposal[]) => {
  return useMemo(
    () =>
      keccak256(
        encodePacked(
          new Array(proposalGroup.length).fill("bytes32"),
          proposalGroup.map((p) => p.id).sort(),
        ),
      ),
    [proposalGroup],
  );
};
