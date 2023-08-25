export enum StakingStatus {
  UNAPPROVED = "unapproved",
  APPROVING = "approving",
  APPROVED = "approved",
  READYTOSTAKE = "readyToStake",
  STAKING = "staking",
  SUCCESS = "success",
  FAILED = "failed",
  UNSTAKING = "unstaking",
}

export enum StakeOrUnstake {
  STAKE = "stake",
  UNSTAKE = "unstake",
}

export type WagmiLoadingStatus = "error" | "idle" | "success" | "loading";
