import { TransactionReceipt } from "viem";
import { useQuery } from "wagmi";

export type Status = ReturnType<typeof useQuery>["status"];

export type TransactionStatusLookup = { [key: string]: Status };
export type TransactionHashLookup = {
  [key: string]: TransactionReceipt | undefined;
};
export type TransactionErrorLookup = {
  [key: string]: boolean;
};

export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
}

export type ActionButton = {
  afterSuccess: { label: string; callback: () => void };
  afterFailure: { label: string; callback: () => void };
};
