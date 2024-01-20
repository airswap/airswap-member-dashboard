import { useAccount, useContractRead } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { stakingAbi } from "../../../contracts/stakingAbi";

export const useStakesForAccount = () => {
  const { address: connectedWallet } = useAccount();
  const [sAstAddress, sAstTokenV4_deprecated] = useContractAddresses(
    [
      ContractTypes.AirSwapStaking_latest,
      ContractTypes.AirSwapV4Staking_deprecated,
    ],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const airSwapStakingLatestContract = {
    address: sAstAddress.address,
    chain: sAstAddress.chainId,
    abi: stakingAbi,
  };
  const airSwapStakingV4DeprecatedContract = {
    address: sAstTokenV4_deprecated.address,
    chain: sAstTokenV4_deprecated.chainId,
    abi: stakingAbi,
  };

  const { data: getStakesLatest } = useContractRead({
    ...airSwapStakingLatestContract,
    functionName: "getStakes",
    args: [connectedWallet!],
  });

  const { data: getStakesV4Deprecated } = useContractRead({
    ...airSwapStakingV4DeprecatedContract,
    functionName: "getStakes",
    args: [connectedWallet!],
  });

  const sAstBalance = getStakesLatest?.balance;
  const sAstBalanceV4Deprecated = getStakesV4Deprecated?.balance;
  const sAstMaturityV4Deprecated = getStakesV4Deprecated?.maturity;

  return {
    sAstBalance,
    sAstBalanceV4Deprecated,
    sAstMaturityV4Deprecated,
  };
};
