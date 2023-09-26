import { Hash } from "viem";
import { create } from "zustand";
import { TxType } from "../types/StakingTypes";

type StakingModalStore = {
  showStakingModal: boolean;
  setShowStakingModal: (show: boolean) => void;
  txType: TxType;
  setTxType: (change: TxType) => void;
  txHash: Hash | undefined;
  setTxHash: (hash: Hash | undefined) => void;
};

const stakingModalStore = create<StakingModalStore>((set) => ({
  showStakingModal: false,
  setShowStakingModal(show: boolean) {
    set({ showStakingModal: show });
  },

  txType: TxType.STAKE,
  setTxType(change: TxType) {
    set({ txType: change });
  },

  txHash: undefined,
  setTxHash(hash: Hash | undefined) {
    set({ txHash: hash });
  },
}));

export const useStakingModalStore = () => {
  const [
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    txHash,
    setTxHash,
  ] = stakingModalStore((state) => [
    state.showStakingModal,
    state.setShowStakingModal,
    state.txType,
    state.setTxType,
    state.txHash,
    state.setTxHash,
  ]);
  return {
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    txHash,
    setTxHash,
  };
};
