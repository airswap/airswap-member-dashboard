import BigNumber from "bignumber.js";

export const bigIntToUnits = (balance: bigint) => {
  const numberOutput = new BigNumber(balance.toString() || 0)
    .dividedBy(10 ** 4)
    .toNumber();

  return numberOutput;
};
