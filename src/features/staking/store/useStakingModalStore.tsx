import { create } from "zustand";

export enum StakeOrUnstake {
  STAKE = "stake",
  UNSTAKE = "unstake",
}

export enum TransactionState {
  ApprovePending = "ApprovePending",
  ApproveSuccess = "ApproveSuccess",
  StakePending = "StakePending",
  StakeSuccess = "StakeSuccess",
  UnstakePending = "UnstakePending",
  UnstakeSuccess = "UnstakeSuccess",
  Failed = "Failed",
  Idle = "Idle",
}

type StakingModalStore = {
  showStakingModal: boolean;
  setShowStakingModal: (show: boolean) => void;
  stakeOrUnstake: StakeOrUnstake;
  setStakeOrUnstake: (change: StakeOrUnstake) => void;
  trackerStatus: TransactionState;
  setTrackerStatus: (change: TransactionState) => void;
};

export const useStakingModalStore = create<StakingModalStore>((set) => ({
  showStakingModal: false,
  setShowStakingModal(show: boolean) {
    set({ showStakingModal: show });
  },

  stakeOrUnstake: StakeOrUnstake.STAKE,
  setStakeOrUnstake(change: StakeOrUnstake) {
    set({ stakeOrUnstake: change });
  },

  trackerStatus: TransactionState.Idle,
  setTrackerStatus(change: TransactionState) {
    set({ trackerStatus: change });
  },
}));
