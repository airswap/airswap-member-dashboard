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

  return {
    unstakablePercent: (unstakable / totalBalance) * 100,
    stakedPercent: (staked / totalBalance) * 100,
    stakablePercent: (stakable / totalBalance) * 100,
  };
};
