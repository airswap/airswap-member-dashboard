import React from "react";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "" }),
    publicProvider(),
  ],
);

const queryClient = new QueryClient();

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  queryClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WALLETCONNECT_ID,
      },
    }),
  ],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>,
);
