import { request, gql } from "graphql-request";
import { useAccount, useQuery } from "wagmi";

// Snapshot docs here: https://docs.snapshot.org/tools/graphql-api

const snapshotGraphqlEndpoint = "https://hub.snapshot.org/graphql";
const VOTES_QUERY = (voter?: string) => gql`
  query {
    votes(
      # TODO: should deal with pagination probably.
      first: 100
      skip: 0
      where: {
        space_in: ["vote.airswap.eth"]
        voter: "${voter}"
      }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      proposal {
        id
      }
      choice
    }
  }
`;

type VotesQueryResult = {
  votes: {
    id: string;
    choice: number;
    proposal: { id: string };
  }[];
};

// TODO: check if we need an API key.
// ref: https://docs.snapshot.org/tools/graphql-api/api-keys

export const useUserVotes = (voter?: `0x${string}`) => {
  const { address: connectedAccount } = useAccount();

  const _voter = voter || connectedAccount;

  const fetch = async () => {
    const result = await request<VotesQueryResult>(
      snapshotGraphqlEndpoint,
      VOTES_QUERY(_voter),
    );
    return result.votes;
  };

  return useQuery(["snapshot", "votes", _voter?.toLowerCase()], fetch, {
    cacheTime: Infinity,
    staleTime: 600_000, // 10 minutes
    enabled: !!_voter,
  });
};
