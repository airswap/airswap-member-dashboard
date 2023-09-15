import { FieldValues, UseFormSetValue } from "react-hook-form";
import { WriteContractResult } from "wagmi/actions";
import { TransactionStatusLookup } from "../types/StakingTypes";

/**
 *
 * @remarks used in StakingModal.tsx. Function is used to render different functions based on which step the user is in the Staking flow. Function gets called when user clicks on button
 */

export const handleButtonActions = ({
  needsApproval,
  canUnstake,
  transactionStatusLookup,
  resetApproveAst,
  resetStakeAst,
  resetUnstakeSast,
  approveAst,
  stakeAst,
  unstakeSast,
  setValue,
}: {
  needsApproval: boolean;
  canUnstake: boolean;
  transactionStatusLookup: TransactionStatusLookup;
  resetApproveAst: () => void;
  resetStakeAst: () => void;
  resetUnstakeSast: () => void;
  approveAst: (() => Promise<WriteContractResult>) | undefined;
  stakeAst: (() => void) | undefined;
  unstakeSast: (() => void) | undefined;
  setValue: UseFormSetValue<FieldValues>;
}) => {
  if (
    transactionStatusLookup.statusApproveAst === "success" &&
    resetApproveAst
  ) {
    return resetApproveAst();
  }

  if (transactionStatusLookup.statusStakeAst === "success" && resetStakeAst) {
    setValue("stakingAmount", 0);
    return resetStakeAst();
  }

  if (
    transactionStatusLookup.statusUnstakeSast === "success" &&
    resetUnstakeSast
  ) {
    setValue("stakingAmount", 0);
    return resetUnstakeSast();
  }

  if (needsApproval && approveAst) {
    return approveAst();
  }

  if (canUnstake && unstakeSast) {
    return unstakeSast();
  }

  if (!needsApproval && stakeAst) {
    return stakeAst();
  }
};
