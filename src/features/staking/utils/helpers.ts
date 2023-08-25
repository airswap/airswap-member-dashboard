import { UseFormSetValue } from "react-hook-form";
import { WriteContractResult } from "wagmi/actions";
import {
  StakeOrUnstake,
  StakingStatus,
  WagmiLoadingStatus,
} from "../types/StakingTypes";

export const buttonStatusText = ({
  statusStaking,
  stakeOrUnstake,
  statusUnstake,
}: {
  statusStaking: StakingStatus;
  stakeOrUnstake: StakeOrUnstake;
  statusUnstake: "success" | "error" | "idle" | "loading";
}) => {
  if (stakeOrUnstake === "stake") {
    switch (statusStaking) {
      case "unapproved":
        return "Approve token";
      case "readyToStake":
        return "Stake";
      case "success":
        return "Manage stake";
      case "failed":
        return "Try again";
    }
  } else {
    if (statusUnstake === "success") {
      return "Manage stake";
    } else {
      return "Unstake";
    }
  }
};

export const modalHeadline = (statusStaking: StakingStatus) => {
  switch (statusStaking) {
    case "unapproved":
      return "Manage Stake";
    case "approving":
      return "Approve token";
    case "approved":
      return "Approve successful";
    case "readyToStake":
      return "Manage stake";
    case "staking":
      return "Sign transaction";
    case "success":
      return "Transaction successful";
    case "failed":
      return "Transaction failed";
  }
};

export const shouldRenderButton = (
  stakeOrUnstake: StakeOrUnstake,
  statusStaking: StakingStatus,
  statusUnstake: WagmiLoadingStatus,
) => {
  if (stakeOrUnstake === "stake") {
    if (
      statusStaking === "approving" ||
      statusStaking === "approved" ||
      statusStaking === "staking"
    ) {
      return false;
    } else {
      return true;
    }
  } else if (stakeOrUnstake === "unstake") {
    if (statusUnstake === "loading") {
      return false;
    } else {
      return true;
    }
  }
};

export const etherscanLink = (
  chainId: number,
  transactionHash: string | undefined,
) => {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/tx/${transactionHash}`;
    case 5:
      return `https://goerli.etherscan.io/tx/${transactionHash}`;
  }
};

type HandleButtonActions = {
  stakeOrUnstake: StakeOrUnstake;
  statusStaking: StakingStatus;
  approve: (() => Promise<WriteContractResult>) | undefined;
  stake: (() => void) | undefined;
  approveReset: () => void;
  writeResetStake: () => void;
  setValue: UseFormSetValue<{ stakingAmount: number }>;
  setStatusStaking: (value: React.SetStateAction<StakingStatus>) => void;
  needsApproval: boolean;
  statusUnstake: WagmiLoadingStatus;
  unstake: (() => void) | undefined;
  writeResetUnstake: () => void;
};

export const handleButtonActions = ({
  stakeOrUnstake,
  statusStaking,
  approve,
  stake,
  approveReset,
  writeResetStake,
  setValue,
  setStatusStaking,
  needsApproval,
  statusUnstake,
  unstake,
  writeResetUnstake,
}: HandleButtonActions) => {
  if (stakeOrUnstake === "stake") {
    switch (statusStaking) {
      case "unapproved":
        approve && approve();
        break;
      case "readyToStake":
        stake && stake();
        break;
      case "success":
        approveReset && approveReset();
        writeResetStake && writeResetStake();
        setValue("stakingAmount", 0);
        setStatusStaking("unapproved");
        break;
      case "failed":
        if (needsApproval) {
          // if approval transaction failed
          approveReset && approveReset();
        } else {
          // if staking transaction failed
          writeResetStake && writeResetStake();
        }
        break;
    }
  } else if (stakeOrUnstake === "unstake") {
    switch (statusUnstake) {
      case "idle":
        unstake && unstake();
        break;
      case "success":
        writeResetUnstake && writeResetUnstake();
        break;
      case "error":
        writeResetUnstake && writeResetUnstake();
        break;
    }
  }
};
