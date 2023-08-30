import { useQuery } from "wagmi";

export enum StakeOrUnstake {
  STAKE = "stake",
  UNSTAKE = "unstake",
}

export type Status = ReturnType<typeof useQuery>["status"];
