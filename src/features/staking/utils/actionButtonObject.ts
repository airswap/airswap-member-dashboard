import { FieldValues, UseFormReturn } from "react-hook-form";

type ActionButton = {
  afterSuccess: { label: string; callback: () => void };
  afterFailure: { label: string; callback: () => void };
};

type ActionButtons = { [k: string]: ActionButton };

/**
 * @remarks this returns button actions that get used when staking modal is in transitions, e.g. between when a user approves and stakes
 *
 */
export const actionButtonsObject = ({
  resetApproveAst,
  resetStakeAst,
  resetUnstakeSast,
  resetUnstakeSastV4Deprecated,
  formReturn,
  setV4UnstakingBalance,
}: {
  resetApproveAst: () => void;
  resetStakeAst: () => void;
  resetUnstakeSast: () => void;
  resetUnstakeSastV4Deprecated: () => void;
  formReturn: UseFormReturn<FieldValues>;
  setV4UnstakingBalance: (balance: number) => void;
}): ActionButtons => {
  const { setValue } = formReturn;

  const actions = {
    approve: {
      afterSuccess: {
        label: "Continue",
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
        callback: () => {
          resetStakeAst();
          setValue("stakingAmount", undefined);
        },
      },
      afterFailure: {
        label: "Try again",
        callback: resetStakeAst,
      },
    },
    unstake: {
      afterSuccess: {
        label: "Manage Stake",
        callback: () => {
          resetUnstakeSast();
          setValue("stakingAmount", undefined);
        },
      },
      afterFailure: {
        label: "Try again",
        callback: resetUnstakeSast,
      },
    },
    unstakeV4Deprecated: {
      afterSuccess: {
        label: "Manage Stake",
        callback: () => {
          resetUnstakeSastV4Deprecated();
          setValue("stakingAmount", undefined);
          setV4UnstakingBalance(0);
        },
      },
      afterFailure: {
        label: "Try again",
        callback: resetUnstakeSastV4Deprecated,
      },
    },
  };

  return actions;
};
