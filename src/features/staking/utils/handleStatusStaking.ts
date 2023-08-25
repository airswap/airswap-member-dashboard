import { Dispatch } from "react";
import { StakeOrUnstake, StakingStatus } from "../types/StakingTypes";

interface HandleStatusStakingProps {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusApprove: "idle" | "error" | "loading" | "success";
  setStatusStaking: Dispatch<StakingStatus>;
  statusStake: "idle" | "error" | "loading" | "success";
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
      setStatusStaking("unapproved");
    } else if (statusApprove === "loading") {
      setStatusStaking("approving");
    } else if (statusApprove === "success") {
      setStatusStaking("approved");
    } else if (statusApprove === "error") {
      setStatusStaking("failed");
    }
  } else if (staking && !needsApproval) {
    if (statusStake === "idle") {
      setStatusStaking("readyToStake");
    } else if (statusStake === "loading") {
      setStatusStaking("staking");
    } else if (statusStake === "error") {
      setStatusStaking("failed");
    }
  } else if ((staking && statusStake === "success") || stakeHash) {
    setStatusStaking("success");
  }
};
