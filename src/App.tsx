import { useEffect } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { Header } from "./features/structure/Header";
import { VoteList } from "./features/votes/VoteList";
import { useApplyTheme } from "./hooks/useApplyTheme";

function App() {
  useApplyTheme();
  const { chain } = useNetwork();

  const { switchNetwork } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
  });

  useEffect(() => {
    if (chain?.id === 1 || chain?.id === 5) {
      null;
    } else {
      switchNetwork && switchNetwork(1);
    }
  }, [chain?.id, switchNetwork]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <Header />
      <main className="mx-auto flex w-[808px] p-2 max-w-full flex-col flex-1">
        <VoteList />
      </main>
    </div>
  );
}

export default App;
