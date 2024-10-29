import { decodeEventLog } from "viem";
import { useContractEvent } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";
import { useStakingModalStore } from "../store/useStakingModalStore";
import { ApprovalLogType } from "../types/StakingTypes";

const decodedApprovalEventLog = (log: ApprovalLogType): bigint | undefined => {
  const lastLog = log[log.length - 1];

  if (lastLog) {
    try {
      const decoded = decodeEventLog({
        abi: astAbi,
        eventName: "Approval",
        data: lastLog.data,
        topics: lastLog.topics,
      });

      if (decoded.eventName === "Approval" && decoded.args) {
        const { value: approvalValue } = decoded.args;
        return approvalValue;
      }
    } catch (error) {
      console.error("Error decoding log:", error);
    }
  } else return;
};

export const useApprovalEvent = () => {
  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });
  const { setApprovalEventLog } = useStakingModalStore();

  useContractEvent({
    address: airSwapToken.address,
    abi: astAbi,
    eventName: "Approval",
    listener: (log) => {
      console.log("log", log);
      const approvalValue = decodedApprovalEventLog(log as ApprovalLogType);
      console.log("approvalValue:", approvalValue);
      setApprovalEventLog(approvalValue || undefined);
    },
  });
};
