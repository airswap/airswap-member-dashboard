import { WriteContractResult } from "wagmi/actions";
import { TxType } from "../types/StakingTypes";

type ButtonActions = {
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => Promise<WriteContractResult>) | undefined;
  unstake: (() => Promise<WriteContractResult>) | undefined;
  switchNetwork: (() => void) | undefined;
};

/**
 *
 * @remarks - this does not take in actions for v4(deprecated) unstaking because that is handled only in the content box in ManageStake.tsx
 */

export const modalButtonActionsAndText = ({
  isSupportedNetwork,
  txType,
  needsApproval,
  buttonActions,
  isInsufficientBalance,
}: {
  isSupportedNetwork: boolean;
  txType: TxType;
  needsApproval: boolean;
  buttonActions: ButtonActions;
  isInsufficientBalance: boolean;
}) => {
  if (!isSupportedNetwork) {
    return {
      label: "Switch to Ethereum",
      callback: buttonActions.switchNetwork,
    };
  } else if (isInsufficientBalance) {
    return {
      label: "Insufficient balance",
      callback: () => null,
    };
  } else if (
    txType === TxType.STAKE &&
    needsApproval &&
    !isInsufficientBalance
  ) {
    return {
      label: "Approve",
      callback: buttonActions.approve,
    };
  } else if (
    txType === TxType.STAKE &&
    !needsApproval &&
    !isInsufficientBalance
  ) {
    return {
      label: "Stake",
      callback: buttonActions.stake,
    };
  } else if (txType === TxType.UNSTAKE) {
    return {
      label: "Unstake",
      callback: buttonActions.unstake,
    };
  }
};
