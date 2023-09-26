import { TransactionReceipt } from "viem";
import { useQuery } from "wagmi";

export enum TxType {
  STAKE = "stake",
  UNSTAKE = "unstake",
}

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
