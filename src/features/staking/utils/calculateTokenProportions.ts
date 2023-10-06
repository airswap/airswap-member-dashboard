export const calculateTokenProportions = ({
  unstakable,
  staked,
  unstaked,
}: {
  unstakable: bigint;
  staked: bigint;
  unstaked: bigint;
}) => {
  const unstakableFormatted = Number(unstakable) / 10 ** 4;
  const stakedFormatted = Number(staked) / 10 ** 4;
  const unstakedFormatted = Number(unstaked) / 10 ** 4;

  const totalBalance = stakedFormatted + unstakedFormatted;

  if (totalBalance === 0) {
    return {
      unstakablePercent: 0,
      stakedPercent: 0,
      unstakedPercent: 0,
    };
  }

  // the following 2 values should take up the entirety of the PieBar
  const totalStakedPercent = (stakedFormatted / totalBalance) * 100;
  const unstakedPercent = (unstakedFormatted / totalBalance) * 100;

  // unstakablePercent and stakedPercent are a percentage of totalStakedPercent
  const unstakablePercent = (unstakableFormatted / stakedFormatted) * 100;
  const stakedPercent =
    (stakedFormatted / stakedFormatted) * 100 - unstakablePercent;

  console.log(totalStakedPercent);

  return {
    unstakablePercent,
    totalStakedPercent,
    unstakedPercent,
    stakedPercent,
  };
};
