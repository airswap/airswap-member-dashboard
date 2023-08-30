import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";

export const useApproveAst = ({
  stakingAmount,
  enabled = true,
}: {
  stakingAmount: number;
  enabled?: boolean;
}) => {
  const { address } = useAccount();
  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: false,
  });

  const [airSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking],
    {
      defaultChainId: 1,
      useDefaultAsFallback: false,
    },
  );

  const { config: configApprove } = usePrepareContractWrite({
    address: airSwapToken.address,
    abi: astAbi,
    functionName: "approve",
    cacheTime: Infinity,
    args: [airSwapStaking.address!, BigInt(+stakingAmount * Math.pow(10, 4))],
    enabled: enabled && stakingAmount > 0 && !!address,
  });

  const {
    writeAsync: approve,
    data: dataApprove,
    reset: resetApprove,
  } = useContractWrite(configApprove);

  const { data: transactionReceiptApprove, status: statusApprove } =
    useWaitForTransaction({
      hash: dataApprove?.hash,
      cacheTime: 60_000, // 1 minute
      onSuccess() {
        resetApprove();
      },
    });

  return { approve, resetApprove, transactionReceiptApprove, statusApprove };
};
