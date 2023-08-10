export type StatusStaking =
  | "unapproved"
  | "approving"
  | "approved"
  | "readyToStake"
  | "staking"
  | "success"
  | "failed";

export type StakeInput = {
  stakingAmount: number;
};
