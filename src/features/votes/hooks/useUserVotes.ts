import { gql, request } from "graphql-request";
import { useAccount, useQuery } from "wagmi";
import {
  SNAPSHOT_HUB_GRAPHQL_ENDPOINT,
  SNAPSHOT_SPACE,
} from "../config/constants";

// Snapshot docs here: https://docs.snapshot.org/tools/graphql-api
const VOTES_QUERY = (voter?: string) => gql`
  query {
    votes(
      # TODO: should deal with pagination probably.
      first: 100
      skip: 0
      where: {
        space_in: ["${SNAPSHOT_SPACE}"]
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
      vp
    }
  }
`;

type VotesQueryResult = {
  votes: {
    id: string;
    choice: number;
    vp: number;
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
      SNAPSHOT_HUB_GRAPHQL_ENDPOINT,
      VOTES_QUERY(_voter),
    );
    return result.votes;
  };

  return useQuery(
    [
      SNAPSHOT_HUB_GRAPHQL_ENDPOINT,
      "votesByVoterAddress",
      _voter?.toLowerCase(),
    ],
    fetch,
    {
      cacheTime: Infinity,
      staleTime: 600_000, // 10 minutes
      enabled: !!_voter,
    },
  );
};
