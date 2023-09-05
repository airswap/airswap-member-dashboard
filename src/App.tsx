import { Header } from "./features/structure/Header";
import { VoteList } from "./features/votes/VoteList";
import { useApplyTheme } from "./hooks/useApplyTheme";
import { useConnectToValidChain } from "./hooks/useConnectToValidChain";

function App() {
  useApplyTheme();
  useConnectToValidChain();

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="mx-auto flex w-[808px] p-2 max-w-full flex-col flex-1">
        <VoteList />
      </main>
    </div>
  );
}

export default App;
