import BigNumber from "bignumber.js";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
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

  const { config: configUnstake } = usePrepareContractWrite({
    address: airSwapStaking.address,
    abi: stakingAbi,
    functionName: "unstake",
    // args: [BigInt(+unstakingAmount * Math.pow(10, 4))],
    args: [
      BigInt(new BigNumber(unstakingAmount).multipliedBy(10 ** 4).toFixed(0)),
    ],
    enabled: canUnstake,
  });

  const {
    write: unstake,
    data,
    reset: resetUnstake,
  } = useContractWrite(configUnstake);

  const { data: transactionReceiptUnstake, status: statusUnstake } =
    useWaitForTransaction({ hash: data?.hash });

  return {
    unstake,
    resetUnstake,
    statusUnstake,
    transactionReceiptUnstake,
  };
};
