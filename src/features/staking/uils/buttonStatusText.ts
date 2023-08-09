export const buttonStatusText = (statusStaking: string): string | null => {
  let buttonText: string | null;
  switch (statusStaking) {
    case 'unapproved':
      buttonText = "Approve token";
      break;
    case "approved":
      buttonText = "Stake"
      break;
    case "staking":
      buttonText = null;
      break;
    case "success":
      buttonText = "Manage stake";
      break;
    default:
      buttonText = "Approve Stake"
      break;
  }
  return buttonText
}
