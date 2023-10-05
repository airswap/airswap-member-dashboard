type PercentObject = {
  unstakablePercent: number;
  stakedPercent: number;
  unstakedPercent: number;
};

export const calculateTokenProportions = ({
  unstakable,
  staked,
  unstaked,
}: {
  unstakable: number;
  staked: number;
  unstaked: number;
}): PercentObject => {
  const totalBalance = unstakable + staked + unstaked;

  if (totalBalance === 0) {
    return {
      unstakablePercent: 0,
      stakedPercent: 0,
      unstakedPercent: 0,
    };
  }

  return {
    unstakablePercent: (unstakable / totalBalance) * 100,
    stakedPercent: (staked / totalBalance) * 100,
    unstakedPercent: (unstaked / totalBalance) * 100,
  };
};
