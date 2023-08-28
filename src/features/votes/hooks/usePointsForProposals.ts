// import { gql, request } from "graphql-request";
// import { useAccount, useQuery } from "wagmi";
// import { useSnapshotConfig } from "./useSnapshotConfig";

// // Snapshot docs here: https://docs.snapshot.org/tools/graphql-api
// const VOTES_QUERY = (
//   space: string,
//   proposalIds: string[],
//   voter?: string,
// ) => gql`
//   query {
//     votes(
//       first: 1000
//       skip: 0
//       where: {
//         space_in: ["${space}"]
//         voter: "${voter}"
//         proposal_in: [${(proposalIds || [])
//           .map((id) => '"' + id + '"')
//           .join(",")}]
//       }
//       orderBy: "created"
//       orderDirection: desc
//     ) {
//       id
//       proposal {
//         id
//       }
//       choice
//       vp
//     }
//   }
// `;

// type VotesQueryResult = {
//   votes: {
//     id: string;
//     choice: number;
//     vp: number;
//     proposal: { id: string };
//   }[];
// };

// // TODO: check if we need an API key.
// // ref: https://docs.snapshot.org/tools/graphql-api/api-keys

// export const useUserVotes = (proposalIds?: string[], voter?: `0x${string}`) => {
//   const snapshot = useSnapshotConfig();
//   const { address: connectedAccount } = useAccount();

//   const _voter = voter || connectedAccount;

//   const fetch = async () => {
//     const result = await request<VotesQueryResult>(
//       snapshot.endpoint,
//       VOTES_QUERY(snapshot.space, _voter),
//     );
//     return result.votes;
//   };

//   return useQuery(
//     [
//       snapshot.endpoint,
//       snapshot.space,
//       "votesByVoterAddress",
//       _voter?.toLowerCase(),
//     ],
//     fetch,
//     {
//       cacheTime: Infinity,
//       staleTime: 600_000, // 10 minutes
//       enabled: !!_voter,
//     },
//   );
// };
