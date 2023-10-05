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
  const totalBalance = staked + unstaked;

  if (totalBalance === 0) {
    return {
      unstakablePercent: 0,
      stakedPercent: 0,
      unstakedPercent: 0,
    };
  }

  const unstakablePercent = (unstakable / totalBalance) * 100;

  const stakedTotalPercent = 100 - unstakablePercent;
  const stakedPercent = (staked / stakedTotalPercent) * 100;
  const unstakedPercent = (unstaked / stakedTotalPercent) * 100;

  return {
    unstakablePercent,
    stakedPercent,
    unstakedPercent,
  };
};
