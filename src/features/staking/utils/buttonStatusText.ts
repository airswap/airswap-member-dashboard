import { StakeOrUnstake, TransactionState } from "../types/StakingTypes";

/**
 *
 * @remarks used in StakingModal.tsx file. Function returns a string that gets rendered onto the button component
 */
export const buttonStatusText = ({
  stakeOrUnstake,
  trackerStatus,
  needsApproval,
}: {
  stakeOrUnstake: StakeOrUnstake;
  trackerStatus: TransactionState;
  needsApproval: boolean;
}) => {
  switch (trackerStatus) {
    case TransactionState.ApprovePending:
      return "Approving";
    case TransactionState.ApproveSuccess:
      return "Manage Stake";
    case TransactionState.StakePending:
      return "Staking";
    case TransactionState.StakeSuccess:
      return "Manage Stake";
    case TransactionState.UnstakePending:
      return "Unstaking";
    case TransactionState.Failed:
      return "Manage Stake";
    case TransactionState.UnstakeSuccess:
      return "manage stake";
    case TransactionState.Idle:
      if (stakeOrUnstake === StakeOrUnstake.UNSTAKE) {
        return "Unstake";
      }
      if (needsApproval && stakeOrUnstake === StakeOrUnstake.STAKE) {
        return "Approve";
      } else {
        return "Stake";
      }
  }
};
