import { Proposal, useProposals } from "./hooks/useProposals";
import { useUserVotes } from "./hooks/useUserVotes";

const ProposalListItem = ({ proposal }: { proposal: Proposal }) => {
  return (
    <div
      className="grid gap-x-4 border border-border-dark px-6 py-5"
      style={{ gridTemplateColumns: "auto 1fr auto" }}
    >
      <span>todo</span>
      <span>{proposal.title}</span>
      <span>todo</span>
    </div>
  );
};

export const VoteList = ({}: {}) => {
  const { data: votes } = useUserVotes();
  const { data: proposals } = useProposals();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Live Votes</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>

      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Past Votes</h3>
      </div>
      <div className="h-px flex-1 bg-border-dark">
        {proposals?.map((proposal) => <ProposalListItem proposal={proposal} />)}
      </div>
    </div>
  );
};
