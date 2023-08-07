import { Header } from "./features/structure/Header";
import { VoteList } from "./features/votes/VoteList";
import { useApplyTheme } from "./hooks/useApplyTheme";

function App() {
  useApplyTheme()

  return (
    <div className="flex flex-col bg-bg-dark">
      <Header />
      <main className="mx-auto flex w-[800px] max-w-full flex-col">
        <VoteList />
      </main>
    </div>
  );
}

export default App;
