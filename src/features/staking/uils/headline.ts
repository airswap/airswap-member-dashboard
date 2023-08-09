export const modalHeadline = (statusStaking: string) => {
  switch (statusStaking) {
    case "unapproved":
      return "Manage Stake"
    case "approving":
      return "Approve Token"
    case "approved":
      return "Approve Success"
    case "readyToStake":
      return "Manage Stake"
    case "staking":
      return "Sign transaction"
    case "success":
      return "Transaction successful"
    case "failed":
      return "Transaction failed"
  }
}
