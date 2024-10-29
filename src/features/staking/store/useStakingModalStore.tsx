import { Hash } from "viem";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TxType } from "../types/StakingTypes";

type StakingModalStore = {
  showStakingModal: boolean;
  setShowStakingModal: (show: boolean) => void;
  txType: TxType;
  setTxType: (change: TxType) => void;
  txHash: string | undefined;
  setTxHash: (hash: Hash | undefined) => void;
  v4UnstakingBalance: number | undefined;
  setV4UnstakingBalance: (balance: number) => void;
  approvalEventLog: bigint | undefined;
  setApprovalEventLog: (log: bigint | undefined) => void;
};

const stakingModalStore = create<StakingModalStore>()(
  persist(
    (set) => ({
      showStakingModal: false,
      setShowStakingModal(show: boolean) {
        set({ showStakingModal: show });
      },

      txType: TxType.UNSTAKE,
      setTxType(change: TxType) {
        set({ txType: change });
      },

      txHash: undefined,
      setTxHash(hash: Hash | undefined) {
        set({ txHash: hash });
      },

      v4UnstakingBalance: undefined,
      setV4UnstakingBalance(balance: number | undefined) {
        set({ v4UnstakingBalance: balance });
      },

      approvalEventLog: undefined,
      setApprovalEventLog(log: bigint | undefined) {
        set({ approvalEventLog: log });
      },
    }),
    {
      name: "stakingModalStorage",
    },
  ),
);

export const useStakingModalStore = stakingModalStore;
