/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SNAPSHOT_HUB_GRAPHQL_ENDPOINT?: string;
  readonly VITE_SNAPSHOT_SPACE?: string;
  readonly VITE_SNAPSHOT_WEB?: string;
  readonly VITE_WALLETCONNECT_ID?: string;
  readonly VITE_INFURA_API_KEY?: string;
  readonly VITE_ACTIVATE_POINTS_LEAVES_URL?: string;
  readonly VITE_ENABLE_ACTIVATE_MIGRATION?: string;
  // more env variables...
}
