import BigNumber from "bignumber.js";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { stakingAbi } from "../../../contracts/stakingAbi";

export const useStakeAst = ({
  stakingAmount,
  enabled = true,
}: {
  stakingAmount: number;
  enabled?: boolean;
}) => {
  const [airSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: false,
    },
  );

  const stakingAmountConversion = new BigNumber(stakingAmount)
    .multipliedBy(10 ** 4)
    .integerValue()
    .toString();

  const { config: configStake } = usePrepareContractWrite({
    address: airSwapStaking.address,
    abi: stakingAbi,
    functionName: "stake",
    args: [BigInt(stakingAmountConversion)],
    enabled: enabled,
  });

  const {
    write: stake,
    data,
    reset: resetStake,
  } = useContractWrite(configStake);

  const {
    data: transactionReceiptStake,
    status: statusStake,
    isError: isErrorStake,
  } = useWaitForTransaction({ hash: data?.hash });

  return {
    stake,
    resetStake,
    transactionReceiptStake,
    statusStake,
    isErrorStake,
  };
};
