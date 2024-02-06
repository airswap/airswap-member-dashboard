import { Address } from "viem";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TxType } from "../types/StakingTypes";

type StakingModalStore = {
  showStakingModal: boolean;
  setShowStakingModal: (show: boolean) => void;
  txType: TxType;
  setTxType: (change: TxType) => void;
  txHash: Address | undefined;
  setTxHash: (hash: Address | undefined) => void;
  v4UnstakingBalance: bigint | undefined;
  setV4UnstakingBalance: (balance: bigint) => void;
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
      setTxHash(hash: Address | undefined) {
        set({ txHash: hash });
      },

      v4UnstakingBalance: undefined,
      setV4UnstakingBalance(balance: bigint | undefined) {
        set({ v4UnstakingBalance: balance });
      },
    }),
    {
      name: "stakingModalStorage",
    },
  ),
);

export const useStakingModalStore = () => {
  const [
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    txHash,
    setTxHash,
    v4UnstakingBalance,
    setV4UnstakingBalance,
  ] = stakingModalStore((state) => [
    state.showStakingModal,
    state.setShowStakingModal,
    state.txType,
    state.setTxType,
    state.txHash,
    state.setTxHash,
    state.v4UnstakingBalance,
    state.setV4UnstakingBalance,
  ]);
  return {
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    txHash,
    setTxHash,
    v4UnstakingBalance,
    setV4UnstakingBalance,
  };
};
