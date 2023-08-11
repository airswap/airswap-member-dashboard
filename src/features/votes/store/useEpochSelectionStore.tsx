import { create } from "zustand";

export type SelectedEpochState = {
  selectedEpochs: string[];
  pointsClaimableByEpoch: Record<string, number>;
  setPointsClaimableForEpoch: (epoch: string, points: number) => void;
  setEpochSelected: (epoch: string, selected: boolean) => void;
  toggleEpoch: (epoch: string) => void;
  clearSelectedEpochs: () => void;
};

export const useEpochSelectionStore = create<SelectedEpochState>((set) => ({
  selectedEpochs: [],
  pointsClaimableByEpoch: {},
  setPointsClaimableForEpoch(epoch: string, points: number) {
    set((state) => {
      const pointsClaimableByEpoch = {
        ...state.pointsClaimableByEpoch,
        [epoch]: points,
      };
      return { pointsClaimableByEpoch };
    });
  },
  setEpochSelected(epoch: string, selected: boolean) {
    set((state) => {
      const selectedEpochs = selected
        ? [...state.selectedEpochs, epoch]
        : state.selectedEpochs.filter((e) => e !== epoch);
      return { selectedEpochs };
    });
  },
  toggleEpoch(epoch: string) {
    set((state) => {
      const selectedEpochs = state.selectedEpochs.includes(epoch)
        ? state.selectedEpochs.filter((e) => e !== epoch)
        : [...state.selectedEpochs, epoch];
      return { selectedEpochs };
    });
  },
  clearSelectedEpochs() {
    set({ selectedEpochs: [] });
  },
}));
