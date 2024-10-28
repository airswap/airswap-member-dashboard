import { decodeEventLog } from "viem";
import { astAbi } from "../../../contracts/astAbi";
import { ApprovalLogType } from "../types/StakingTypes";

export const decodedEventLog = (log: ApprovalLogType): bigint | null => {
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
  }
  return null;
};
