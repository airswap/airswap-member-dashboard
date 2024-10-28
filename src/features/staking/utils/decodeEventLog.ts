import { decodeEventLog } from "viem";
import { astAbi } from "../../../contracts/astAbi";
import { ApprovalLogType } from "../types/StakingTypes";

export const decodedEventLog = (log: ApprovalLogType) => {
  const logArray = log[1] || log[0];
  if (logArray && logArray.topics.length > 0) {
    try {
      const decoded = decodeEventLog({
        abi: astAbi,
        data: logArray.data,
        topics: logArray.topics as [
          signature: `0x${string}`,
          ...args: `0x${string}`[],
        ],
      });

      if (decoded.eventName === "Approval" && decoded.args) {
        return {
          data: logArray.data,
          topics: logArray.topics,
        };
      }
    } catch (error) {
      console.error("Error decoding log:", error);
    }
  }
  return null;
};
