import BigNumber from "bignumber.js";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { stakingAbi } from "../../../contracts/stakingAbi";

/**
 *
 * @param unstakingAmount - takes in stakingAmount from react-hook-form-register
 * @param canUnstake - boolean value, true if unstakingAmount (stakingAmount) > 0 and if unstakigAmount (stakingAmount) <= sAST balance
 */
export const useUnstakeSast = ({
  unstakingAmount,
  canUnstake,
}: {
  unstakingAmount: number;
  canUnstake: boolean;
}) => {
  const [airSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: false,
    },
  );

  const unstakingAmountConversion = new BigNumber(unstakingAmount)
    .multipliedBy(10 ** 4)
    .integerValue()
    .toString();

  const { config: configUnstake } = usePrepareContractWrite({
    address: airSwapStaking.address,
    abi: stakingAbi,
    functionName: "unstake",
    args: [BigInt(unstakingAmountConversion)],
    enabled: canUnstake,
  });

  const {
    writeAsync: unstakeSast,
    data: dataUnstakeSast,
    reset: resetUnstakeSast,
  } = useContractWrite(configUnstake);

  return {
    unstakeSast,
    resetUnstakeSast,
    dataUnstakeSast,
  };
};
