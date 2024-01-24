import BigNumber from "bignumber.js";

export const convertBigIntToBigNumber = (balance: bigint | number) => {
  const bigNumber = new BigNumber(balance.toString() || "0")
    .dividedBy(10 ** 4)
    .toNumber();

  return bigNumber;
};
