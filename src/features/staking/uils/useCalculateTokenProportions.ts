export const useCalculateTokenProportions = (
  unstakable: string,
  staked: string,
  stakable: string,
) => {
  const totalBalance = Number(unstakable) + Number(staked) + Number(stakable);
  const unstakablePercent = (Number(unstakable) / totalBalance) * 100;
  const stakedPercent = (Number(staked) / totalBalance) * 100;
  const stakablePercent = (Number(stakable) / totalBalance) * 100;

  return { unstakablePercent, stakedPercent, stakablePercent };
};
