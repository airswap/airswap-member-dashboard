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

      txHash: undefined,
      setTxHash(hash: Address | undefined) {
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
