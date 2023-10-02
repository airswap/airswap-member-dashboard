import { useSnapshotConfig } from "./useSnapshotConfig";

export const useSnapshotProposalUrl = (proposalId?: string) => {
  const { voteSiteUrlBase, space } = useSnapshotConfig();

  return `${voteSiteUrlBase}${space}/proposal/${proposalId}`;
};
