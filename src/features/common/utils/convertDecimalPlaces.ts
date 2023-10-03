export const convertDecimalPlaces = (balance: bigint) => {
  const formattedBalance = Number(balance) / 10**4;
  return formattedBalance.toLocaleString(navigator.language, {maximumFractionDigits: 2, notation: "compact"})
}
