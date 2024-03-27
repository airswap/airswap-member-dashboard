import {
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { avalanche, bsc, goerli, polygon } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import App from "./App.tsx";
import AirSwapLogo from "./assets/airswap-logo.svg";
import "./index.css";
import { isPlainObject } from "./utils/isPlainObject.ts";

import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

// Fonts:
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer;
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, avalanche, bsc, polygon],
  [
    // uncomment to use local node.
    // jsonRpcProvider({
    //   rpc: () => ({
    //     http: "http://localhost:8545",
    //   }),
    // }),
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY || "" }),
    publicProvider(),
  ],
  {
    batch: {
      multicall: {
        // enable batched multicall
        wait: 100,
      },
    },
  },
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: function hashQueryKey(queryKey: QueryKey): string {
        return JSON.stringify(queryKey, (_, val) =>
          typeof val === "bigint"
            ? val.toString()
            : isPlainObject(val)
            ? Object.keys(val)
                .sort()
                .reduce(
                  (result, key) => {
                    result[key] = val[key];
                    return result;
                  },
                  {} as Record<string, unknown>,
                )
            : val,
        );
      },
    },
  },
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  queryClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "AirSwap Member Dashboard",
        appLogoUrl: AirSwapLogo,
      },
    }),
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
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>,
);

console.log("Build commit hash: " + process.env.COMMIT_HASH);
