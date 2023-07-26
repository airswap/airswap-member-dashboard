import { request, gql } from "graphql-request";
import { useQuery } from "wagmi";
import { SNAPSHOT_HUB_GRAPHQL_ENDPOINT } from "../config/constants";

// Snapshot docs here: https://docs.snapshot.org/tools/graphql-api
const PROPOSALS_QUERY = gql`
  query {
    proposals(
      first: 100
      skip: 0
      where: { space_in: ["vote.airswap.eth"] }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      end
      snapshot
      state
    }
  }
`;

export type Proposal = {
  id: string;
  title: string;
  /** This is a **unix timestamp** (seconds, not ms).  */
  end: number;
  /** Block number as a string */
  snapshot: string;
  state: "closed" | "open";
};

type ProposalsQueryResult = {
  proposals: {
    id: string;
    title: string;
    /** This is a **unix timestamp** (seconds, not ms).  */
    end: number;
    /** Block number as a string */
    snapshot: string;
    state: "closed" | "open";
  }[];
};

export const useProposals = () => {
  const fetch = async () => {
    const result = await request<ProposalsQueryResult>(
      SNAPSHOT_HUB_GRAPHQL_ENDPOINT,
      PROPOSALS_QUERY,
    );
    return result.proposals;
  };

  return useQuery(["snapshot", "proposals"], fetch, {
    cacheTime: Infinity,
    staleTime: 3_600_000, // 1 hour
  });
};
