import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ClaimNftState = {
  /** Whether or not we are showing the claim modal */
  showClaimNftModal: boolean;
  setShowClaimNftModal: (show: boolean) => void;
}

const defaultState = {
  showClaimNftModal: false,
}

export const useClaimNftStore = create<ClaimNftState>()(
  persist(
    (set) => ({
      ...defaultState,
      setShowClaimNftModal(show: boolean) {
        set({ showClaimNftModal: show });
      },
    }),
    {
      name: "claimNftStore",
    },
  ),
);