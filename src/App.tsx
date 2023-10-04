import { Header } from "./features/structure/Header";
import { ClaimFloat } from "./features/votes/ClaimFloat";
import { VoteList } from "./features/votes/VoteList";
import { useClaimSelectionStore } from "./features/votes/store/useClaimSelectionStore";
import { useApplyTheme } from "./hooks/useApplyTheme";

function App() {
  useApplyTheme();
  const { setShowClaimModal } = useClaimSelectionStore();

  return (
    <div className="flex flex-col flex-1 h-full items-center">
      <Header />
      <main className="mx-auto flex w-[808px] p-2 max-w-full flex-col flex-1">
        <VoteList />
      </main>
      <ClaimFloat onClaimClicked={() => setShowClaimModal(true)} />
    </div>
  );
}

export default App;
