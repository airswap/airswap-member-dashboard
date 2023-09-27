import { WriteContractResult } from "wagmi/actions";
import { TxType } from "../types/StakingTypes";

type ButtonActions = {
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => Promise<WriteContractResult>) | undefined;
  unstake: (() => Promise<WriteContractResult>) | undefined;
};

export const modalButtonActionsAndText = ({
  txType,
  needsApproval,
  buttonActions,
  insufficientBalance,
}: {
  txType: TxType;
  needsApproval: boolean;
  buttonActions: ButtonActions;
  insufficientBalance?: boolean;
}) => {
  if (insufficientBalance) {
    return {
      label: "Insufficient balance",
      callback: () => null,
    };
  }
  if (txType === TxType.STAKE && needsApproval) {
    return {
      label: "Approve",
      callback: buttonActions.approve,
    };
  } else if (txType === TxType.STAKE && !needsApproval) {
    return {
      label: "Stake",
      callback: buttonActions.stake,
    };
  }
  if (txType === TxType.UNSTAKE) {
    return {
      label: "Unstake",
      callback: buttonActions.unstake,
    };
  }
};
