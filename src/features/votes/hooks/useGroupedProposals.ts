import { gql, request } from "graphql-request";
import { useQuery } from "wagmi";
import {
  SNAPSHOT_HUB_GRAPHQL_ENDPOINT,
  SNAPSHOT_SPACE,
} from "../config/constants";

// Snapshot docs here: https://docs.snapshot.org/tools/graphql-api
const PROPOSALS_QUERY = gql`
  query {
    proposals(
      first: 100
      skip: 0
      where: { space_in: ["${SNAPSHOT_SPACE}"] }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      start
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
  start: number;
  /** This is a **unix timestamp** (seconds, not ms).  */
  end: number;
  /** Block number as a string */
  snapshot: string;
  state: "closed" | "open" | "pending";
};

type ProposalsQueryResult = {
  proposals: Proposal[];
};

/**
 *
 * @returns Groups of proposals. Each group contains proposals that have the
 * same start and end.
 */
export const useGroupedProposals = () => {
  const fetch = async () => {
    const result = await request<ProposalsQueryResult>(
      SNAPSHOT_HUB_GRAPHQL_ENDPOINT,
      PROPOSALS_QUERY,
    );
    const proposalGroups: Proposal[][] = [];

    // group all proposals that have the same start and end
    result.proposals.forEach((proposal) => {
      const group = proposalGroups.find(
        (group) =>
          group[0].start === proposal.start && group[0].end === proposal.end,
      );
      if (group) {
        group.push(proposal);
      } else {
        proposalGroups.push([proposal]);
      }
    });

    return proposalGroups;
  };

  return useQuery([SNAPSHOT_HUB_GRAPHQL_ENDPOINT, "proposals"], fetch, {
    cacheTime: Infinity,
    staleTime: 3_600_000, // 1 hour
  });
};
