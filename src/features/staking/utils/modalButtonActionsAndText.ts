import { WriteContractResult } from "wagmi/actions";
import { TxType } from "../types/StakingTypes";

type ButtonActions = {
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => Promise<WriteContractResult>) | undefined;
  unstake: (() => Promise<WriteContractResult>) | undefined;
  switchNetwork: (() => void) | undefined;
  unstakeV4Deprecated?: (() => Promise<WriteContractResult>) | undefined;
};

export const modalButtonActionsAndText = ({
  isSupportedNetwork,
  txType,
  needsApproval,
  buttonActions,
  insufficientBalance,
}: {
  isSupportedNetwork: boolean;
  txType: TxType;
  needsApproval: boolean;
  buttonActions: ButtonActions;
  insufficientBalance?: boolean;
}) => {
  if (!isSupportedNetwork) {
    return {
      label: "Switch to Ethereum",
      callback: buttonActions.switchNetwork,
    };
  } else if (insufficientBalance) {
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
  // TODO: implement when v4 unstaking should be enabled
  // if (txType === TxType.UNSTAKE) {
  //   return {
  //     label: "Unstake V4.0 balance",
  //     callback: buttonActions.unstakeV4Deprecated,
  //   };
  // }
};
