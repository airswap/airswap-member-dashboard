import { gql, request } from "graphql-request";
import { useQuery } from "wagmi";
import { SNAPSHOT_HUB_GRAPHQL_ENDPOINT } from "../config/constants";

// Snapshot docs here: https://docs.snapshot.org/tools/graphql-api

const VOTES_FOR_PROPOSALS_QUERY = (proposalIds?: string[]) => gql`
  query {
    votes(
      first: 1000
      where: {
        proposal_in: [${proposalIds || [].map((id) => `"${id}"`).join(",")}])}],
      }
    ) {
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
export const useProposalGroupVotes = (proposalIds?: string[]) => {
  const fetch = async () => {
    const result = await request<VotesByProposalQueryResult>(
      SNAPSHOT_HUB_GRAPHQL_ENDPOINT,
      VOTES_FOR_PROPOSALS_QUERY(proposalIds),
    );
    return result.votes;
  };

  return useQuery(
    [SNAPSHOT_HUB_GRAPHQL_ENDPOINT, "votesByProposalIds", proposalIds],
    fetch,
    {
      // FIXME: remove all Infinity caches and have a configurable cache time
      cacheTime: Infinity,
      // TODO: Should be possible to increase this to be much more aggresively cached
      // if we ensure that this is only requested for closed proposals.
      staleTime: 600_000, // 10 minutes
      enabled: !!proposalIds && proposalIds.length > 0,
    },
  );
};
