import { Header } from "./features/structure/Header";
import { VoteList } from "./features/votes/VoteList";

function App() {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="mx-auto w-[800px] max-w-full flex flex-col">
        <VoteList />
      </main>
    </div>
  );
}

export default App;
