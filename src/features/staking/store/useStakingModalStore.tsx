import { Hash } from "viem";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TxType } from "../types/StakingTypes";

type StakingModalStore = {
  showStakingModal: boolean;
  setShowStakingModal: (show: boolean) => void;
  txType: TxType;
  setTxType: (change: TxType) => void;
  stakingAmount: string;
  setStakingAmount: (change: string) => void;
  txHash: Hash | undefined;
  setTxHash: (hash: Hash | undefined) => void;
};

const stakingModalStore = create<StakingModalStore>()(
  persist(
    (set) => ({
      showStakingModal: false,
      setShowStakingModal(show: boolean) {
        set({ showStakingModal: show });
      },

      txType: TxType.STAKE,
      setTxType(change: TxType) {
        set({ txType: change });
      },

      stakingAmount: "0",
      setStakingAmount(change: string) {
        set({ stakingAmount: change });
      },

      txHash: undefined,
      setTxHash(hash: Hash | undefined) {
        set({ txHash: hash });
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
    stakingAmount,
    setStakingAmount,
    txHash,
    setTxHash,
  ] = stakingModalStore((state) => [
    state.showStakingModal,
    state.setShowStakingModal,
    state.txType,
    state.setTxType,
    state.stakingAmount,
    state.setStakingAmount,
    state.txHash,
    state.setTxHash,
  ]);
  return {
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    stakingAmount,
    setStakingAmount,
    txHash,
    setTxHash,
  };
};
