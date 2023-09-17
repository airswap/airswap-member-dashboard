import { WriteContractResult } from "wagmi/actions";
import { TxType } from "../store/useStakingModalStore";

type ButtonActions = {
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => Promise<WriteContractResult>) | undefined;
  unstake: (() => Promise<WriteContractResult>) | undefined;
};

export const modalButtonActionsAndText = ({
  txType,
  needsApproval,
  buttonActions,
}: {
  txType: TxType;
  needsApproval: boolean;
  buttonActions: ButtonActions;
}) => {
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
      label: "Unstale",
      callback: buttonActions.unstake,
    };
  }
};
