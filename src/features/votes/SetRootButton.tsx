import { twMerge } from "tailwind-merge";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { poolAbi } from "../../contracts/poolAbi";
import { Button } from "../common/Button";
import { useGroupHash } from "./hooks/useGroupHash";
import { useGroupMerkleRoot } from "./hooks/useGroupMerkleRoot";
import { Proposal } from "./hooks/useGroupedProposals";
import { useIsPoolAdmin } from "./hooks/useIsPoolAdmin";
import { useProposalGroupVotes } from "./hooks/useProposalGroupVotes";
import { useTreeRoots } from "./hooks/useTreeRoots";

/**
 * Button to set the root for a proposal. Only shown to pool admins.
 */
export const SetRootButton = ({
  className,
  proposalGroup,
}: {
  className?: string;
  proposalGroup: Proposal[];
}) => {
  // Only admins can submit roots
  const { data: isPoolAdmin } = useIsPoolAdmin();
  const groupHash = useGroupHash(proposalGroup);

  const hasEnded = proposalGroup[0].end * 1000 < Date.now();

  // We only want to show the submit root button if there isn't already a root set
  const [{ data: existingRoot, refetch: refetchRoot, isError }] = useTreeRoots({
    treeIds: [groupHash],
    enabled: isPoolAdmin && hasEnded,
  });

  // Calculate the root when we have one
  const { data: merkleRoot } = useGroupMerkleRoot(
    proposalGroup.map((p) => p.id),
    // Note: hasEnded is not strictly necessary here as (`existingRoot` will be
    // undefined not null), but we include it for clarity.
    { enabled: !!isPoolAdmin && existingRoot === null && hasEnded },
  );

  const { data: votes } = useProposalGroupVotes(
    proposalGroup.map((p) => p.id),
    {
      enabled: !!isPoolAdmin && existingRoot === null && hasEnded,
    },
  );
  // Write the root

  const [airswapPool] = useContractAddresses([ContractTypes.AirSwapPool], {
    defaultChainId: 1,
    useDefaultAsFallback: false,
    alwaysUseDefault: false,
  });

  const { config } = usePrepareContractWrite({
    ...airswapPool,
    abi: poolAbi,
    functionName: "enable",
    args: [groupHash, merkleRoot!],
    enabled: !!merkleRoot,
  });
  const { write: sendRoot, data: sendRootTxData } = useContractWrite(config);

  // Show a toast when the transaction succeeds.
  useWaitForTransaction({
    // NOTE: when there is no hash, this will do nothing.
    hash: sendRootTxData?.hash,
    onSuccess: () => {
      // TODO: show toast
      // Refetch the root so we don't show the button anymore.
      refetchRoot();
    },
  });

  // If the root is already set, or we don't have one to set yet, show nothing.
  if (!hasEnded || !isPoolAdmin || existingRoot !== null || !merkleRoot)
    return null;

  return (
    <Button
      className={twMerge([], className)}
      disabled={!sendRoot}
      onClick={sendRoot}
      rounded
      size="small"
      color="primary"
    >
      Set root ({votes?.length || 0} votes)
    </Button>
  );
};
