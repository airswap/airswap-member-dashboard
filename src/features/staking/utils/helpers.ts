import { FieldValues, UseFormSetValue } from "react-hook-form";
import { WriteContractResult } from "wagmi/actions";
import { StakeOrUnstake, Status } from "../types/StakingTypes";

export const buttonStatusText = ({
  stakeOrUnstake,
  needsApproval,
  statusApprove,
  statusStake,
  statusUnstake,
}: {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
}) => {
  const unstaking = stakeOrUnstake === StakeOrUnstake.UNSTAKE;
  if (unstaking && statusUnstake === "idle") {
    return "Unstake";
  } else if (unstaking && statusUnstake === "loading") {
    return "Unstaking...";
  } else if (unstaking && statusUnstake === "success") {
    return "Manage stake";
  } else if (statusStake === "success") {
    return "Manage Stake";
  } else if (needsApproval && statusApprove === "idle") {
    return "Approve token";
  } else if (needsApproval && statusApprove === "loading") {
    return "Approving...";
  } else if (!needsApproval && statusStake === "idle") {
    return "Stake";
  } else if (!needsApproval && statusStake === "loading") {
    return "Staking...";
  }
};

export const buttonLoadingSpinner = ({
  stakeOrUnstake,
  needsApproval,
  statusApprove,
  statusStake,
  statusUnstake,
}: {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
}) => {
  const unstaking = stakeOrUnstake === StakeOrUnstake.UNSTAKE;
  if (needsApproval && statusApprove === "loading") {
    return true;
  } else if (!needsApproval && statusStake === "loading") {
    return true;
  } else if (unstaking && statusUnstake === "loading") {
    return true;
  } else {
    return false;
  }
};

export const modalHeadline = ({
  statusStake,
  statusUnstake,
}: {
  statusStake: Status;
  statusUnstake: Status;
}) => {
  if (statusStake === "success" || statusUnstake === "success") {
    return "Transaction successful";
  } else if (statusStake === "error" || statusUnstake === "error") {
    return "Transaction failed";
  } else {
    return "Manage Stake";
  }
};

export const etherscanLink = (
  chainId: number,
  transactionHash: string | undefined,
) => {
  const chainUrls: { [x: number]: string } = {
    1: "https://etherscan.io/tx/",
    5: "https://goerli.etherscan.io/tx/",
  };

  return `${chainUrls[chainId]}${transactionHash}`;
};

export const handleButtonActions = ({
  stakeOrUnstake,
  needsApproval,
  statusStake,
  statusUnstake,
  resetStake,
  resetUnstake,
  canUnstake,
  approve,
  stake,
  unstake,
  setValue,
}: {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusStake: Status;
  statusUnstake: Status;
  resetStake: () => void;
  resetUnstake: () => void;
  canUnstake: boolean;
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => void) | undefined;
  unstake: (() => void) | undefined;
  setValue: UseFormSetValue<FieldValues>;
}) => {
  const stakeMode = stakeOrUnstake === StakeOrUnstake.STAKE;

  if (stakeMode && statusStake === "success") {
    setValue("stakingAmount", 0);
    return resetStake && resetStake();
  } else if (!stakeMode && statusUnstake === "success") {
    setValue("stakingAmount", 0);
    return resetUnstake && resetUnstake();
  } else if (stakeMode && needsApproval) {
    return approve && approve();
  } else if (stakeMode && !needsApproval) {
    return stake && stake();
  } else if (!stakeMode && canUnstake) {
    return unstake && unstake();
  }
};
