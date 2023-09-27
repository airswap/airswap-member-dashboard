import { gql, request } from "graphql-request";
import { useAccount, useQuery } from "wagmi";
import { useSnapshotConfig } from "./useSnapshotConfig";

// Snapshot docs here: https://docs.snapshot.org/tools/graphql-api
const VOTES_QUERY = (space: string, voter?: string) => gql`
  query {
    votes(
      # TODO: should deal with pagination probably.
      first: 1000
      skip: 0
      where: {
        space_in: ["${space}"]
        voter: "${voter}"
      }
      orderBy: "created"
      orderDirection: desc
    ) {
      proposal {
        id
      }
      vp
    }
  }
`;

type VotesQueryResult = {
  votes: {
    vp: number;
    proposal: { id: string };
  }[];
};

// TODO: check if we need an API key.
// ref: https://docs.snapshot.org/tools/graphql-api/api-keys

export const useUserVotes = (voter?: `0x${string}`) => {
  const snapshot = useSnapshotConfig();
  const { address: connectedAccount } = useAccount();

  const _voter = voter || connectedAccount;

  const fetch = async () => {
    const result = await request<VotesQueryResult>(
      snapshot.apiEndpoint,
      VOTES_QUERY(snapshot.space, _voter),
    );
    return result.votes;
  };

  return useQuery(
    [
      snapshot.apiEndpoint,
      snapshot.space,
      "votesByVoterAddress",
      _voter?.toLowerCase(),
    ],
    fetch,
    {
      cacheTime: 600_000,
      staleTime: 600_000, // 10 minutes
      enabled: !!_voter,
    },
  );
};
