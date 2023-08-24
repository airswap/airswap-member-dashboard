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
  // ✅ 1. "unapproved": if astAllowance is too low && (statusApprove === "idle") || (statusApprove === "error")
  // ✅ -- if (statusApprove === "error") { SETUP ERROR HANDLING }
  // ✅ 2. "approving": if astAllowance is too low && (statusApprove === "loading")
  // ✅ 3. "approved": if astAllowance is too low && (statusApprove === "success")
  // ✅ 4. "readyToStake": if (astAllowance >= stakingAmount && statusStake === "idle")
  // ✅ -- if (astAllowance >= stakingAmount && statusStake === "error") { SETUP ERROR HANDLING }
  // ✅ 5. "staking": if (astAllowance >= stakingAmount && statusStake === "loading")
  // ✅ 6. "success": if (astAllowance >= stakingAmount && statusStake === "success")
  // ✅ 7. "failed": if (astAllowance >= stakingAmount && statusStake === "error")
  if (needsApproval) {
    if (statusApprove === "idle") {
      setStatusStaking("unapproved");
    } else if (statusApprove === "error") {
      setStatusStaking("failed");
    } else if (statusApprove === "loading") {
      setStatusStaking("approving");
    } else if (statusApprove === "success") {
      setStatusStaking("approved");
    }
  } else if (!needsApproval) {
    if (statusStake === "idle") {
      setStatusStaking("readyToStake");
    } else if (statusStake === "loading") {
      setStatusStaking("staking");
    } else if (statusStake === "success") {
      setStatusStaking("success");
    } else if (statusStake === "error") {
      setStatusStaking("failed");
    }
  }
};
