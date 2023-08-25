export type StakingStatus =
  | "unapproved"
  | "approving"
  | "approved"
  | "readyToStake"
  | "staking"
  | "success"
  | "failed"
  | "unstaking";

export type StakeOrUnstake = "stake" | "unstake";

export type WagmiLoadingStatus = "success" | "error" | "idle" | "loading";
