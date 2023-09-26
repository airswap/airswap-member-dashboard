import request, { gql } from "graphql-request";
import { useQuery } from "wagmi";
import { useSnapshotConfig } from "./useSnapshotConfig";

// Snapshot docs here: https://docs.snapshot.org/tools/graphql-api
const VOTES_FOR_PROPOSALS_QUERY = (proposalIds?: string[]) => gql`
  query {
    votes(first: 1000, where: { proposal_in: [${(proposalIds || [])
      .map((id) => '"' + id + '"')
      .join(",")}]}) {
      proposal {
        id
      }
      voter
      vp
    }
  }
`;

type VotesByProposalQueryResult = {
  votes: {
    voter: `0x${string}`;
    /** Note this is a float. It can have more than 4 decimals */
    vp: number;
    proposal: {
      id: string;
    };
  }[];
};

// TODO: check if we need an API key.
// ref: https://docs.snapshot.org/tools/graphql-api/api-keys

/**
 * Pulls a list of voters and their vote weights for a given proposal.
 * Used to generate merkle trees both for generating and uploading a root, by
 * admins, and for voters to create a proof that can be used to withdraw
 * from the pool.
 * @param proposalId If undefined, query is disabled.
 */
export const useProposalGroupVotes = (
  proposalIds?: string[],
  options?: { enabled: boolean },
) => {
  const snapshot = useSnapshotConfig();
  const fetch = async () => {
    const result = await request<VotesByProposalQueryResult>(
      snapshot.endpoint,
      VOTES_FOR_PROPOSALS_QUERY(proposalIds),
    );
    return result.votes;
  };

  return useQuery(
    [snapshot.endpoint, "votesByProposalIds", proposalIds],
    fetch,
    {
      // Note that this is a large payload, and we want to avoid caching it for
      // extended amounts of time.
      cacheTime: 600_000, // 10 minutes
      staleTime: 600_000, // 10 minutes
      enabled:
        !!proposalIds && proposalIds.length > 0 && (options?.enabled ?? true),
    },
  );
};
