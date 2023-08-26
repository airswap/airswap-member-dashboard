import { UseFormSetValue } from "react-hook-form";
import { WriteContractResult } from "wagmi/actions";
import { StakeOrUnstake, WagmiLoadingStatus } from "../types/StakingTypes";

export const buttonStatusText = ({
  stakeOrUnstake,
  needsApproval,
  statusApprove,
  statusStake,
  statusUnstake,
}: {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusApprove: WagmiLoadingStatus;
  statusStake: WagmiLoadingStatus;
  statusUnstake: WagmiLoadingStatus;
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
    return "Aproving...";
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
  statusApprove: WagmiLoadingStatus;
  statusStake: WagmiLoadingStatus;
  statusUnstake: WagmiLoadingStatus;
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

// TODO: fix this
export const modalHeadline = ({
  statusStake,
  statusUnstake,
}: {
  statusStake: WagmiLoadingStatus;
  statusUnstake: WagmiLoadingStatus;
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
  statusStake: WagmiLoadingStatus;
  statusUnstake: WagmiLoadingStatus;
  resetStake: () => void;
  resetUnstake: () => void;
  canUnstake: boolean;
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => void) | undefined;
  unstake: (() => void) | undefined;
  setValue: UseFormSetValue<{ stakingAmount: number }>;
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
