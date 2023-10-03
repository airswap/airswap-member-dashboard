import { FieldValues, UseFormReturn } from "react-hook-form";

type ActionButton = {
  afterSuccess: { label: string; callback: () => void };
  afterFailure: { label: string; callback: () => void };
};

type ActionButtons = { [k: string]: ActionButton };

export const actionButtonsObject = ({
  resetApproveAst,
  resetStakeAst,
  resetUnstakeSast,
  formReturn,
}: {
  resetApproveAst: () => void;
  resetStakeAst: () => void;
  resetUnstakeSast: () => void;
  formReturn: UseFormReturn<FieldValues>;
}): ActionButtons => {
  const { setValue } = formReturn;
  return {
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
  };
};
