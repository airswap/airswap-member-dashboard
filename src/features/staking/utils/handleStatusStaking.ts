import { Dispatch } from "react";
import { StakingStatus, WagmiLoadingStatus } from "../types/StakingTypes";

interface HandleStatusStakingProps {
  needsApproval: boolean;
  statusApprove: WagmiLoadingStatus;
  setStatusStaking: Dispatch<StakingStatus>;
  statusStake: WagmiLoadingStatus;
  stakeHash: string | undefined;
}

export const handleStatusStaking = ({
  needsApproval,
  statusApprove,
  setStatusStaking,
  statusStake,
  stakeHash,
}: HandleStatusStakingProps) => {
  // TODO: simplify this code

  if (needsApproval && statusApprove === "idle" && statusStake !== "success") {
    setStatusStaking(StakingStatus.UNAPPROVED);
  } else if (statusApprove === "loading") {
    setStatusStaking(StakingStatus.APPROVING);
  } else if (statusApprove === "success") {
    setStatusStaking(StakingStatus.APPROVED);
  } else if (statusApprove === "error") {
    setStatusStaking(StakingStatus.FAILED);
  } else if (!needsApproval && statusStake === "idle") {
    setStatusStaking(StakingStatus.READYTOSTAKE);
  } else if (statusStake === "loading") {
    setStatusStaking(StakingStatus.STAKING);
  } else if (statusStake === "error") {
    setStatusStaking(StakingStatus.FAILED);
  } else if (statusStake === "success" || stakeHash) {
    setStatusStaking(StakingStatus.SUCCESS);
  }
};
