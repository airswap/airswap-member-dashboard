import { FieldValues, UseFormSetValue } from "react-hook-form";
import { WriteContractResult } from "wagmi/actions";
import { StakeOrUnstake, Status } from "../types/StakingTypes";

/**
 *
 * @remarks used in StakingModal.tsx. Function is used to render different functions based on which step the user is in the Staking flow. Function gets called when user clicks on button
 */

export const handleButtonActions = ({
  stakeOrUnstake,
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
  stakeOrUnstake: StakeOrUnstake;
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
  const stakeMode = stakeOrUnstake === StakeOrUnstake.STAKE;

  if (stakeMode && statusStake === "success") {
    setValue("stakingAmount", 0);
    return resetStake && resetStake();
  } else if (!stakeMode && statusUnstake === "success") {
    setValue("stakingAmount", 0);
    return resetUnstake && resetUnstake();
  } else if (stakeMode && needsApproval) {
    return approve && approve();
  } else if (stakeMode && !needsApproval) {
    return stake && stake();
  } else if (!stakeMode && canUnstake) {
    return unstake && unstake();
  }
};
