import { ActionButton } from "../types/StakingTypes";

type ActionButtons = { [k: string]: ActionButton };

export const actionButtonsObject = ({
  resetApproveAst,
  resetStakeAst,
  resetUnstakeSast,
}: {
  resetApproveAst: () => void;
  resetStakeAst: () => void;
  resetUnstakeSast: () => void;
}): ActionButtons => {
  return {
    approve: {
      afterSuccess: {
        label: "Manage Stake",
        callback: resetApproveAst,
      },
      afterFailure: {
        label: "Try again",
        callback: resetApproveAst,
      },
    },
    stake: {
      afterSuccess: {
        label: "Manage Stake",
        callback: resetStakeAst,
      },
      afterFailure: {
        label: "Try again",
        callback: resetStakeAst,
      },
    },
    unstake: {
      afterSuccess: {
        label: "Manage Stake",
        callback: resetUnstakeSast,
      },
      afterFailure: {
        label: "Try again",
        callback: resetUnstakeSast,
      },
    },
  };
};
