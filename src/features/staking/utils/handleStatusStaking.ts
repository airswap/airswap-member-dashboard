import { Dispatch } from "react";
import {
  StakeOrUnstake,
  StakingStatus,
  WagmiLoadingStatus,
} from "../types/StakingTypes";

interface HandleStatusStakingProps {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusApprove: WagmiLoadingStatus;
  setStatusStaking: Dispatch<StakingStatus>;
  statusStake: WagmiLoadingStatus;
  stakeHash: string | undefined;
}

export const handleStatusStaking = ({
  stakeOrUnstake,
  needsApproval,
  statusApprove,
  setStatusStaking,
  statusStake,
  stakeHash,
}: HandleStatusStakingProps) => {
  const staking = stakeOrUnstake === "stake";

  if (staking && needsApproval && !stakeHash) {
    if (statusApprove === "idle" && statusStake !== "success") {
      setStatusStaking(StakingStatus.UNAPPROVED);
    } else if (statusApprove === "loading") {
      setStatusStaking(StakingStatus.APPROVING);
    } else if (statusApprove === "success") {
      setStatusStaking(StakingStatus.APPROVED);
    } else if (statusApprove === "error") {
      setStatusStaking(StakingStatus.FAILED);
    }
  } else if (staking && !needsApproval) {
    if (statusStake === "idle") {
      setStatusStaking(StakingStatus.READYTOSTAKE);
    } else if (statusStake === "loading") {
      setStatusStaking(StakingStatus.STAKING);
    } else if (statusStake === "error") {
      setStatusStaking(StakingStatus.FAILED);
    }
  } else if ((staking && statusStake === "success") || stakeHash) {
    setStatusStaking(StakingStatus.SUCCESS);
  }
};
