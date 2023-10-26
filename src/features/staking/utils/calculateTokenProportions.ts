type PercentObject = {
  totalStakedPercent: number;
  unstakablePercent: number;
  stakedPercent: number;
  unstakedPercent: number;
};

export const calculateTokenProportions = ({
  unstakable,
  staked,
  unstaked,
}: {
  unstakable: bigint;
  staked: bigint;
  unstaked: bigint;
}): PercentObject => {
  const unstakableNum = Number(unstakable);
  const stakedNum = Number(staked);
  const unstakedNum = Number(unstaked);
  const totalBalance = stakedNum + unstakedNum;

  if (totalBalance === 0) {
    return {
      totalStakedPercent: 0,
      unstakablePercent: 0,
      stakedPercent: 0,
      unstakedPercent: 0,
    };
  }

  const unstakedPercent = (unstakedNum / totalBalance) * 100;

  // this number gets passed into a div which wraps staked and unstakable
  const totalStakedPercent = 100 - unstakedPercent;
  // this is a percentage of totalStakedPercent
  const unstakablePercent = (unstakableNum / stakedNum) * 100;
  // this is a percentage of totalStakedPercent
  const stakedPercent = 100 - unstakablePercent;

  return {
    totalStakedPercent,
    unstakablePercent,
    stakedPercent,
    unstakedPercent,
  };
};
