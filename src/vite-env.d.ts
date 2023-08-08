/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SNAPSHOT_HUB_GRAPHQL_ENDPOINT?: string;
  readonly VITE_SNAPSHOT_SPACE?: string;
  readonly VITE_SNAPSHOT_WEB?: string;
  readonly VITE_WALLETCONNECT_ID?: string;
  // more env variables...
}
