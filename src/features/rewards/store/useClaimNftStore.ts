import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ClaimNftState = {
  /** Whether or not we are showing the claim modal */
  showClaimNftModal: boolean;
  setShowClaimNftModal: (show: boolean) => void;
  isClaimLoading: boolean;
  setIsClaimLoading: (isClaimLoading: boolean) => void;
}

const defaultState = {
  showClaimNftModal: false,
  isClaimLoading: false,
}

export const useClaimNftStore = create<ClaimNftState>()(
  persist(
    (set) => ({
      ...defaultState,
      setShowClaimNftModal(show: boolean) {
        set({ showClaimNftModal: show });
      },
      setIsClaimLoading(isClaimLoading: boolean) {
        set({ isClaimLoading });
      },
    }),
    {
      name: "claimNftStore",
    },
  ),
);