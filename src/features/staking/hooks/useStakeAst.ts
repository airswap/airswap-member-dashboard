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

  const { config: configStake } = usePrepareContractWrite({
    address: airSwapStaking.address,
    abi: stakingAbi,
    functionName: "stake",
    args: [BigInt(+stakingAmount * Math.pow(10, 4))],
    enabled: enabled && stakingAmount > 0,
  });

  const {
    write: stake,
    data,
    reset: resetStake,
  } = useContractWrite(configStake);

  const { data: transactionReceiptStake, status: statusStake } =
    useWaitForTransaction({ hash: data?.hash });

  return { stake, resetStake, transactionReceiptStake, statusStake };
};
