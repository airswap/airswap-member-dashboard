import { Fragment } from "react";
import { useAccount, useChainId } from "wagmi";
import { ActivatePointsCard } from "../activate-migration/ActivatePointsCard";
import { NON_MAINNET_START_TIMESTAMP } from "../activate-migration/constants";
import { ClaimForm } from "../claims/ClaimForm";
import { ClaimModalSubheading } from "../claims/ClaimModalSubheading";
import { CustomTokensForm } from "../claims/CustomTokensForm";
import { Modal } from "../common/Modal";
import { LiveVoteCard } from "./LiveVoteCard";
import { PastEpochCard } from "./PastEpochCard";
import { SetRootButton } from "./SetRootButton";
import { VoteListSkeletons } from "./VoteListSkeletons";
import { useGroupedProposals } from "./hooks/useGroupedProposals";
import { useTreeRoots } from "./hooks/useTreeRoots";
import { useClaimSelectionStore } from "./store/useClaimSelectionStore";

export const VoteList = ({}: {}) => {
  const chainId = useChainId();
  const { address: connectedAccount } = useAccount();
  const { data: proposalGroups, isLoading: proposalGroupsLoading } =
    useGroupedProposals();
  const [
    showClaimModal,
    setShowClaimModal,
    isClaimLoading,
    showCustomTokensModal,
    setShowCustomTokensModal,
  ] = useClaimSelectionStore((state) => [
    state.showClaimModal,
    state.setShowClaimModal,
    state.isClaimLoading,
    state.showCustomTokensModal,
    state.setShowCustomTokensModal,
  ]);

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
          proposals[0].end * 1000 > Date.now() ||
          (rootQueries[i].data == null &&
            // For chains other than mainnet, only show a start date after November.
            (chainId === 1 ||
              proposals[0].start > NON_MAINNET_START_TIMESTAMP)),
      );

  const pastProposalGroups = rootsLoading
    ? []
    : proposalGroups?.filter(
        (proposals, i) =>
          proposals[0].end * 1000 < Date.now() && rootQueries[i].data != null,
      );

  const showLoadingState = proposalGroupsLoading || rootsLoading;

  return (
    <div className="flex flex-col gap-4 p-4 relative flex-1 overflow-hidden">
      {showLoadingState ? (
        <VoteListSkeletons />
      ) : (
        <>
          {/* Active Votes */}
          {liveProposalGroups && liveProposalGroups.length !== 0 && (
            <>
              <div className="flex flex-row items-center gap-2">
                <h3 className="text-xs font-bold uppercase text-gray-500">
                  Votes
                </h3>
                <div className="h-px flex-1 bg-gray-800"></div>
              </div>
              {liveProposalGroups?.map((group) => {
                return (
                  <Fragment key={group[0].id}>
                    {group.map((proposal) => (
                      <LiveVoteCard
                        proposal={proposal}
                        key={`${proposal.id}--${chainId}-${connectedAccount}`}
                      />
                    ))}
                    <SetRootButton
                      proposalGroup={group}
                      className="self-center"
                    />
                  </Fragment>
                );
              })}
            </>
          )}

          {/* Inactive Votes */}
          <div className="flex flex-row items-center gap-4">
            <h3 className="text-xs font-bold uppercase text-gray-500">
              Rewards
            </h3>
            <div className="h-px flex-1 bg-gray-800"></div>
          </div>
          {pastProposalGroups && pastProposalGroups.length !== 0 && (
            <>
              <div className="flex flex-col gap-2">
                {pastProposalGroups?.map((group) => (
                  <PastEpochCard
                    proposalGroup={group}
                    key={`${group[0].id}-${chainId}-${connectedAccount}`}
                  />
                ))}
              </div>
              {/* Spacer to allow overscroll to cover the height of the claim float. */}
            </>
          )}

          <ActivatePointsCard />
          <div className="h-28" />
        </>
      )}

      {/* Claim Float */}

      {/* Claim modal. */}
      {showClaimModal && !showCustomTokensModal && (
        <Modal
          onCloseRequest={() => setShowClaimModal(false)}
          heading="Claim"
          isClosable={!isClaimLoading}
          subHeading={<ClaimModalSubheading />}
          className={`${showCustomTokensModal ? "hidden" : ""}`}
        >
          <ClaimForm />
        </Modal>
      )}
      {showCustomTokensModal && (
        <Modal
          onCloseRequest={() => setShowCustomTokensModal(false)}
          heading="Edit tokens"
          subHeading={"Add or remove custom tokens"}
        >
          <CustomTokensForm />
        </Modal>
      )}
    </div>
  );
};
