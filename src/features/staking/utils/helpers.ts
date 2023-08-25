import { WriteContractResult } from "wagmi/actions";
import {
  StakeOrUnstake,
  StakingStatus,
  WagmiLoadingStatus,
} from "../types/StakingTypes";

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
  if (statusStake === "success") {
    return "Manage Stake";
  } else if (needsApproval && statusApprove === "idle") {
    return "Approve token";
  } else if (needsApproval && statusApprove === "loading") {
    return "Aproving...";
  } else if (!needsApproval && statusStake === "idle") {
    return "Stake";
  } else if (!needsApproval && statusStake === "loading") {
    return "Staking...";
  } else if (unstaking && statusUnstake === "idle") {
    return "Unstake";
  } else if (unstaking && statusUnstake === "loading") {
    return "Unstaking...";
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

// export const buttonStatusText = ({
//   needsApproval,
//   statusStaking,
//   stakeOrUnstake,
//   statusUnstake,
// }: {
//   needsApproval: boolean;
//   statusStaking: StakingStatus;
//   stakeOrUnstake: StakeOrUnstake;
//   statusUnstake: "success" | "error" | "idle" | "loading";
// }) => {
//   if (needsApproval) {
//     return "Approve token";
//   }
//   if (stakeOrUnstake === StakeOrUnstake.STAKE) {
//     switch (statusStaking) {
//       case "unapproved":
//         return "Approve token";
//       case "readyToStake":
//         return "Stake";
//       case "success":
//         return "Manage stake";
//       case "failed":
//         return "Try again";
//     }
//   } else {
//     if (statusUnstake === "success") {
//       return "Manage stake";
//     } else {
//       return "Unstake";
//     }
//   }
// };

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
    default:
      return "Manage Stake";
  }
};

export const shouldRenderButton = (
  stakeOrUnstake: StakeOrUnstake,
  statusStaking: StakingStatus,
  statusUnstake: WagmiLoadingStatus,
) => {
  return stakeOrUnstake === "stake"
    ? statusStaking !== "approving" &&
        statusStaking !== "approved" &&
        statusStaking !== "staking"
    : statusUnstake !== "loading";

  // if (stakeOrUnstake === "stake") {
  //   if (
  //     statusStaking === "approving" ||
  //     statusStaking === "approved" ||
  //     statusStaking === "staking"
  //   ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // } else {
  //   if (statusUnstake === "loading") {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
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
}) => {
  const stakeMode = stakeOrUnstake === StakeOrUnstake.STAKE;

  if (stakeMode && needsApproval) {
    return approve && approve();
  } else if (stakeMode && !needsApproval) {
    return stake && stake();
  } else if (stakeMode && statusStake === "success") {
    return resetStake && resetStake();
  } else if (!stakeMode && canUnstake) {
    return unstake && unstake();
  } else if (!stakeMode && statusUnstake === "success") {
    return resetUnstake && resetUnstake();
  }
};

// type HandleButtonActions = {
//   stakeOrUnstake: StakeOrUnstake;
//   statusStaking: StakingStatus;
//   approve: (() => Promise<WriteContractResult>) | undefined;
//   stake: (() => void) | undefined;
//   approveReset: () => void;
//   writeResetStake: () => void;
//   setValue: UseFormSetValue<{ stakingAmount: number }>;
//   setStatusStaking: (value: React.SetStateAction<StakingStatus>) => void;
//   needsApproval: boolean;
//   statusUnstake: WagmiLoadingStatus;
//   unstake: (() => void) | undefined;
//   writeResetUnstake: () => void;
// };

// export const handleButtonActions = ({
//   stakeOrUnstake,
//   statusStaking,
//   approve,
//   stake,
//   approveReset,
//   writeResetStake,
//   setValue,
//   setStatusStaking,
//   needsApproval,
//   statusUnstake,
//   unstake,
//   writeResetUnstake,
// }: HandleButtonActions) => {
//   if (stakeOrUnstake === "stake") {
//     switch (statusStaking) {
//       case "unapproved":
//         approve && approve();
//         break;
//       case "readyToStake":
//         stake && stake();
//         break;
//       case "success":
//         approveReset && approveReset();
//         writeResetStake && writeResetStake();
//         setValue("stakingAmount", 0);
//         setStatusStaking(StakingStatus.UNAPPROVED);
//         break;
//       case "failed":
//         if (needsApproval) {
//           // if approval transaction failed
//           approveReset && approveReset();
//         } else {
//           // if staking transaction failed
//           writeResetStake && writeResetStake();
//         }
//         break;
//     }
//   } else if (stakeOrUnstake === "unstake") {
//     switch (statusUnstake) {
//       case "idle":
//         unstake && unstake();
//         break;
//       case "success":
//         writeResetUnstake && writeResetUnstake();
//         break;
//       case "error":
//         writeResetUnstake && writeResetUnstake();
//         break;
//     }
//   }
// };
