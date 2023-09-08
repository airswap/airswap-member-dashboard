import { FieldValues, UseFormSetValue } from "react-hook-form";
import { WriteContractResult } from "wagmi/actions";
import { Status } from "../types/StakingTypes";

/**
 *
 * @remarks used in StakingModal.tsx. Function is used to render different functions based on which step the user is in the Staking flow. Function gets called when user clicks on button
 */

export const handleButtonActions = ({
  needsApproval,
  statusStake,
  statusUnstake,
  resetStake,
  resetUnstake,
  canUnstake,
  approve,
  stake,
  unstake,
  setValue,
}: {
  needsApproval: boolean;
  statusStake: Status;
  statusUnstake: Status;
  resetStake: () => void;
  resetUnstake: () => void;
  canUnstake: boolean;
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => void) | undefined;
  unstake: (() => void) | undefined;
  setValue: UseFormSetValue<FieldValues>;
}) => {
  if (statusStake === "success") {
    setValue("stakingAmount", 0);
    return resetStake && resetStake();
  } else if (statusUnstake === "success") {
    setValue("stakingAmount", 0);
    return resetUnstake && resetUnstake();
  } else if (needsApproval) {
    return approve && approve();
  } else if (canUnstake) {
    return unstake && unstake();
  } else if (!needsApproval) {
    return stake && stake();
  }
};
