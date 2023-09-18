import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import { Hash } from "viem";
import { create } from "zustand";

export enum TxType {
  STAKE = "stake",
  UNSTAKE = "unstake",
}

type StakingModalStore = {
  formReturn: UseFormReturn<FieldValues>;
  showStakingModal: boolean;
  setShowStakingModal: (show: boolean) => void;
  txType: TxType;
  setTxType: (change: TxType) => void;
  txHash: Hash | undefined;
  setTxHash: (hash: Hash | undefined) => void;
};

const stakingModalStore = create<StakingModalStore>((set) => ({
  formReturn: useForm(),

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
    formReturn,
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    txHash,
    setTxHash,
  ] = stakingModalStore((state) => [
    state.formReturn,
    state.showStakingModal,
    state.setShowStakingModal,
    state.txType,
    state.setTxType,
    state.txHash,
    state.setTxHash,
  ]);
  return {
    formReturn,
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    txHash,
    setTxHash,
  };
};
