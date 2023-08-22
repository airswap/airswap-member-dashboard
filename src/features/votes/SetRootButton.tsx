import { twMerge } from "tailwind-merge";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { AirSwapPoolAbi } from "../../abi/AirSwapPool";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { Button } from "../common/Button";
import { useGroupMerkleRoot } from "./hooks/useGroupMerkleRoot";
import { Proposal } from "./hooks/useGroupedProposals";
import { useIsPoolAdmin } from "./hooks/useIsPoolAdmin";
import { useRootByTree } from "./hooks/useRootByTree";

const EMPTY_ROOT =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
/**
 * Button to set the root for a proposal. Only shown to pool admins.
 */
export const SetRootButton = ({
  className,
  groupId,
  proposalGroup,
}: {
  className?: string;
  groupId: `0x${string}`;
  proposalGroup: Proposal[];
}) => {
  // Only admins can submit roots
  const { data: isPoolAdmin } = useIsPoolAdmin();
  // We only want to show the submit root button if there isn't already a root set
  const {
    data: existingRoot,
    isLoading: existingRootLoading,
    refetch: refetchRoot,
  } = useRootByTree({
    treeId: groupId,
    enabled: isPoolAdmin,
  });

  const hasRoot = !existingRootLoading && existingRoot !== EMPTY_ROOT;

  // Calculate the root when we have one
  const { data: merkleRoot } = useGroupMerkleRoot(
    proposalGroup.map((p) => p.id),
    { enabled: !hasRoot },
  );

  // Write the root

  const [airswapPool] = useContractAddresses([ContractTypes.AirSwapPool], {
    defaultChainId: 1,
    useDefaultAsFallback: false,
    alwaysUseDefault: false,
  });

  const { config, status: prepareWriteStatus } = usePrepareContractWrite({
    ...airswapPool,
    abi: AirSwapPoolAbi,
    functionName: "enable",
    args: [groupId, merkleRoot!],
    enabled: !!merkleRoot && merkleRoot !== "0x",
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
  if (!isPoolAdmin || hasRoot || !merkleRoot || merkleRoot === "0x")
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
      Set root
    </Button>
  );
};
