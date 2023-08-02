import { VoteListItem } from "./VoteListItem";
import { useGroupedProposals } from "./hooks/useGroupedProposals";

export const VoteList = ({}: {}) => {
  const { data: proposalGroups } = useGroupedProposals();

  // Note that all proposals have the same start and end, so if the first one
  // in the group is live, they all are.
  const liveProposalGroups = proposalGroups?.filter(
    (proposals) => proposals[0].end * 1000 > Date.now(),
  );

  const pastProposalGroups = proposalGroups?.filter(
    (proposals) => proposals[0].end * 1000 < Date.now(),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Live votes</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      {liveProposalGroups?.map((group) => (
        <VoteListItem proposalGroup={group} key={group[0].id} />
      ))}

      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Past Epochs</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      <div className="flex flex-col gap-9">
        {pastProposalGroups?.map((group) => (
          <VoteListItem proposalGroup={group} key={group[0].id} />
        ))}
      </div>
    </div>
  );
};
