import { useMemo } from "react";
import { getGroupHash } from "../utils/getGroupHash";
import { Proposal } from "./useGroupedProposals";

/** Hashes groupIds used as keys for roots & claims */
export const useGroupHash = (proposalGroup: Proposal[]) => {
  return useMemo(
    () => getGroupHash(proposalGroup.map((p) => p.id)),
    [proposalGroup],
  );
};
