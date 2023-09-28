import { Hash } from "viem";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Status, TxType } from "../types/StakingTypes";

type StakingModalStore = {
  showStakingModal: boolean;
  setShowStakingModal: (show: boolean) => void;
  txType: TxType;
  setTxType: (change: TxType) => void;
  isTxLoading: boolean;
  setIsTxLoading: (change: boolean) => void;
  txStatus: Status;
  setTxStatus: (change: Status) => void;
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

      isTxLoading: false,
      setIsTxLoading(change: boolean) {
        set({ isTxLoading: change });
      },

      txStatus: "idle",
      setTxStatus(change: Status) {
        set({ txStatus: change });
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
    isTxLoading,
    setIsTxLoading,
    txStatus,
    setTxStatus,
    txHash,
    setTxHash,
  ] = stakingModalStore((state) => [
    state.showStakingModal,
    state.setShowStakingModal,
    state.txType,
    state.setTxType,
    state.isTxLoading,
    state.setIsTxLoading,
    state.txStatus,
    state.setTxStatus,
    state.txHash,
    state.setTxHash,
  ]);
  return {
    showStakingModal,
    setShowStakingModal,
    txType,
    setTxType,
    isTxLoading,
    setIsTxLoading,
    txStatus,
    setTxStatus,
    txHash,
    setTxHash,
  };
};
