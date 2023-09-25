type PercentObject = {
  unstakablePercent: number;
  stakedPercent: number;
  stakablePercent: number;
};

export const calculateTokenProportions = ({
  unstakable,
  staked,
  stakable,
}: {
  unstakable: number;
  staked: number;
  stakable: number;
}): PercentObject => {
  const totalBalance = unstakable + staked + stakable;

  if (totalBalance === 0) {
    return {
      unstakablePercent: 0,
      stakedPercent: 0,
      stakablePercent: 0,
    };
  }

  return {
    unstakablePercent: (unstakable / totalBalance) * 100,
    stakedPercent: (staked / totalBalance) * 100,
    stakablePercent: (stakable / totalBalance) * 100,
  };
};
