import BigNumber from "bignumber.js";

export const formatNumber = (
  number?: number | bigint,
  decimals: number | null = null,
) => {
  if (number === 0 || number === 0n) return "0";
  else if (!number) return undefined;

  let _number;
  if (decimals) {
    _number = new BigNumber(number.toString())
      .dividedBy(10 ** decimals)
      .toNumber();
  } else {
    _number = number;
  }
  return _number.toLocaleString(window.navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    minimumSignificantDigits: 3,
    maximumSignificantDigits: 3,
    notation: "compact",
  });
};
