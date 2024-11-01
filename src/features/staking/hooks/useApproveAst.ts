import { Log, zeroAddress } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";
import { useStakingModalStore } from "../store/useStakingModalStore";
import { ApprovalLogType } from "../types/StakingTypes";
import { decodedApprovalEventLog } from "./utils/decodedApprovalEventLog";

export const useApproveAst = ({
  stakingAmount,
  enabled = true,
}: {
  stakingAmount: bigint;
  enabled?: boolean;
}) => {
  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: false,
  });

  const [airSwapStaking] = useContractAddresses(
    [ContractTypes.AirSwapStaking_latest],
    {
      defaultChainId: 1,
      useDefaultAsFallback: false,
    },
  );

  const { setApprovalEventLog } = useStakingModalStore();

  const { config: configApprove } = usePrepareContractWrite({
    address: airSwapToken?.address,
    abi: astAbi,
    functionName: "approve",
    args: [airSwapStaking?.address || zeroAddress, stakingAmount],
    enabled: enabled && !!airSwapStaking?.address,
  });

  const {
    writeAsync: approveAst,
    data: dataApproveAst,
    reset,
    isLoading,
  } = useContractWrite(configApprove);

  // Wait for the transaction to succeed and get the transaction receipt
  useWaitForTransaction({
    hash: dataApproveAst?.hash,
    enabled: !!dataApproveAst?.hash,
    onSuccess: async (transactionReceipt) => {
      if (!transactionReceipt?.logs || !airSwapToken?.address) return;

      // Filter and map logs for compatibility with ApprovalLogType
      const approvalLogs: ApprovalLogType[] = transactionReceipt.logs
        .filter(
          (log): log is Log<bigint, number> =>
            log.address.toLowerCase() === airSwapToken.address!.toLowerCase(),
        )
        .map((log) => ({
          ...log,
          blockHash: log.blockHash ?? undefined, // Convert null to undefined for compatibility
        }));

      const decodedValues = decodedApprovalEventLog(approvalLogs);
      decodedValues.forEach((value) => {
        setApprovalEventLog(value.toString()); // Store the approval value in Zustand
      });
    },
  });

  return { approveAst, data: dataApproveAst, reset, isLoading };
};
