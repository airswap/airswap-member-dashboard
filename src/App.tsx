import { useAccount } from "wagmi";
import { MigrationModal } from "./features/staking/MigrationModal";
import { DisconnectedState } from "./features/structure/DisconnectedState";
import { Header } from "./features/structure/Header";
import { ClaimFloat } from "./features/votes/ClaimFloat";
import { VoteList } from "./features/votes/VoteList";
import { useClaimSelectionStore } from "./features/votes/store/useClaimSelectionStore";
import { useApplyTheme } from "./hooks/useApplyTheme";

function App() {
  useApplyTheme();
  const { setShowClaimModal } = useClaimSelectionStore();
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col flex-1 h-full items-center">
      <Header />
      <main className="mx-auto flex w-[808px] p-0 xs:p-2 max-w-full flex-col flex-1">
        {isConnected ? <VoteList /> : <DisconnectedState />}
      </main>
      <MigrationModal />
      <ClaimFloat onClaimClicked={() => setShowClaimModal(true)} />
    </div>
  );
}

export default App;
