import { useAccount } from "wagmi";
import { DisconnectedState } from "./features/structure/DisconnectedState";
import { Header } from "./features/structure/Header";
import { ClaimFloat } from "./features/votes/ClaimFloat";
import { VoteList } from "./features/votes/VoteList";
import { useClaimSelectionStore } from "./features/votes/store/useClaimSelectionStore";
import { useApplyTheme } from "./hooks/useApplyTheme";
import { ClaimableAssetList } from "./features/votes/ClaimableAssetList";

function App() {
  useApplyTheme();
  const { setShowClaimModal } = useClaimSelectionStore();
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col flex-1 h-full items-center">
      <Header />
      <main className="mx-auto flex w-[808px] p-0 xs:p-2 max-w-full flex-col flex-1">
        {isConnected ? <>
          <ClaimableAssetList />
          <VoteList />
          <div className="h-28" />
        </> : <DisconnectedState />}
      </main>
      <ClaimFloat onClaimClicked={() => setShowClaimModal(true)} />
    </div>
  );
}

export default App;
