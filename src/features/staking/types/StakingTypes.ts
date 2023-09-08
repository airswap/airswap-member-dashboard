import { useQuery } from "wagmi";

export enum StakeOrUnstake {
  STAKE = "stake",
  UNSTAKE = "unstake",
}

export type Status = ReturnType<typeof useQuery>["status"];

export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
}

export type TransactionTrackerStatus =
  | "ApprovePending"
  | "ApproveSuccess"
  | "StakePending"
  | "StakeSuccess"
  | "UnstakePending"
  | "UnstakeSuccess"
  | "Failed";
