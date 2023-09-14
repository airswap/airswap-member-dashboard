import { FieldValues, UseFormSetValue } from "react-hook-form";
import { WriteContractResult } from "wagmi/actions";
import { Status } from "../types/StakingTypes";

/**
 *
 * @remarks used in StakingModal.tsx. Function is used to render different functions based on which step the user is in the Staking flow. Function gets called when user clicks on button
 */

export const handleButtonActions = ({
  needsApproval,
  canUnstake,
  statusApprove,
  statusStake,
  statusUnstake,
  resetApprove,
  resetStake,
  resetUnstake,
  approve,
  stake,
  unstake,
  setValue,
}: {
  needsApproval: boolean;
  canUnstake: boolean;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
  resetApprove: () => void;
  resetStake: () => void;
  resetUnstake: () => void;
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => void) | undefined;
  unstake: (() => void) | undefined;
  setValue: UseFormSetValue<FieldValues>;
}) => {
  if (statusApprove === "success" && resetApprove) {
    return resetApprove();
  }

  if (statusStake === "success" && resetStake) {
    setValue("stakingAmount", 0);
    return resetStake();
  }

  if (statusUnstake === "success" && resetUnstake) {
    setValue("stakingAmount", 0);
    return resetUnstake();
  }

  if (needsApproval && approve) {
    return approve();
  }

  if (canUnstake && unstake) {
    return unstake();
  }

  if (!needsApproval && stake) {
    return stake();
  }
};
