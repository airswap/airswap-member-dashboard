import { ClaimForm } from "../claims/ClaimForm";
import { Modal } from "../common/Modal";
import { ClaimFloat } from "./ClaimFloat";
import { LiveVoteCard } from "./LiveVoteCard";
import { PastEpochCard } from "./PastEpochCard";
import { useGroupedProposals } from "./hooks/useGroupedProposals";
import { useTreeRoots } from "./hooks/useTreeRoots";
import { useEpochSelectionStore } from "./store/useEpochSelectionStore";

export const VoteList = ({}: {}) => {
  const { data: proposalGroups } = useGroupedProposals();
  const [showClaimModal, setShowClaimModal] = useEpochSelectionStore(
    (state) => [state.showClaimModal, state.setShowClaimModal],
  );

  // Fetch proposal roots.
  const rootQueries = useTreeRoots({
    proposalIds: proposalGroups?.map((pg) => pg.map((p) => p.id)),
  });

  // This is true if any of the queries for the roots are loading.
  const rootsLoading = rootQueries.some((q) => q.isLoading);

  // Note that all proposals have the same start and end, so if the first one
  // in the group is live, they all are.
  const liveProposalGroups = rootsLoading
    ? []
    : proposalGroups?.filter(
        (proposals, i) =>
          proposals[0].end * 1000 > Date.now() || rootQueries[i].data == null,
      );

  const pastProposalGroups = rootsLoading
    ? []
    : proposalGroups?.filter(
        (proposals, i) =>
          proposals[0].end * 1000 < Date.now() && rootQueries[i].data != null,
      );

  return (
    <div className="flex flex-col gap-4 p-4 relative flex-1 overflow-hidden">
      {/* Active Votes */}
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Live votes</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      {liveProposalGroups?.map((group) =>
        group.map((proposal) => (
          <LiveVoteCard proposal={proposal} key={proposal.id} />
        )),
      )}

      {/* Inactive Votes */}
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Past Epochs</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      <div className="flex flex-col gap-5">
        {pastProposalGroups?.map((group) => (
          <PastEpochCard proposalGroup={group} key={group[0].id} />
        ))}
      </div>

      {/* Claim Float */}
      <ClaimFloat onClaimClicked={() => setShowClaimModal(true)} />

      {/* Claim modal. */}
      {showClaimModal && (
        <Modal onCloseRequest={() => setShowClaimModal(false)}>
          <ClaimForm />
        </Modal>
      )}
    </div>
  );
};
