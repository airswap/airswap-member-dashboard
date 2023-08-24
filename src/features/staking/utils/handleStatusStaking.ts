import { Dispatch } from "react";
import { StakingStatus } from "../types/StakingTypes";

interface HandleStatusStakingProps {
  needsApproval: boolean;
  statusApprove: "idle" | "error" | "loading" | "success";
  setStatusStaking: Dispatch<StakingStatus>;
  statusStake: "idle" | "error" | "loading" | "success";
}

export const handleStatusStaking = ({
  needsApproval,
  statusApprove,
  setStatusStaking,
  statusStake,
}: HandleStatusStakingProps) => {
  if (needsApproval) {
    if (statusApprove === "idle" && statusStake !== "success") {
      setStatusStaking("unapproved");
    } else if (statusApprove === "loading") {
      setStatusStaking("approving");
    } else if (statusApprove === "success") {
      setStatusStaking("approved");
    } else if (statusApprove === "error") {
      setStatusStaking("failed");
    }
  } else if (!needsApproval) {
    if (statusStake === "idle") {
      setStatusStaking("readyToStake");
    } else if (statusStake === "loading") {
      setStatusStaking("staking");
    } else if (statusStake === "error") {
      setStatusStaking("failed");
    }
  } else if (statusStake === "success") {
    setStatusStaking("success");
  }
};
