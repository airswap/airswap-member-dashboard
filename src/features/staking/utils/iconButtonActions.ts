import { Status } from "../types/StakingTypes";

// When a transaction is processing, the main Stake button is hidden, so users must click the icon button to progress in the staking flow and get back to the main "manage stake" screen
export const iconButtonActions = ({
  statusApprove,
  statusStake,
  statusUnstake,
  isErrorApprove,
  isErrorStake,
  isErrorUnstake,
  resetApprove,
  resetStake,
  resetUnstake,
}: {
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
  isErrorApprove: boolean;
  isErrorStake: boolean;
  isErrorUnstake: boolean;
  resetApprove: () => void;
  resetStake: () => void;
  resetUnstake: () => void;
}) => {
  if ((statusApprove === "success" || isErrorApprove) && resetApprove) {
    resetApprove();
  } else if ((statusStake === "success" || isErrorStake) && resetStake) {
    resetStake();
  } else if ((statusUnstake === "success" || isErrorUnstake) && resetUnstake) {
    resetUnstake();
  } else {
    null;
  }
};
