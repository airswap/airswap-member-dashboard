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
    args: [BigInt(unstakingAmount * Math.pow(10, 4))],
    enabled: canUnstake,
  });

  const {
    write: unstake,
    data,
    reset: resetUnstake,
  } = useContractWrite(configUnstake);

  const {
    data: transactionReceiptUnstake,
    status: statusUnstake,
    isError: isErrorUnstake,
  } = useWaitForTransaction({ hash: data?.hash });

  return {
    unstake,
    resetUnstake,
    statusUnstake,
    transactionReceiptUnstake,
    isErrorUnstake,
  };
};
