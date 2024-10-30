import { decodeEventLog } from "viem";
import { astAbi } from "../../../../contracts/astAbi";
import { ApprovalLogType } from "../../types/StakingTypes";

export const decodedApprovalEventLog = (logs: ApprovalLogType[]): bigint[] => {
  return logs
    ?.map((log) => {
      if (log) {
        try {
          const decoded = decodeEventLog({
            abi: astAbi,
            eventName: "Approval",
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "Approval" && decoded.args) {
            return decoded.args.value;
          }
        } catch (error) {
          console.error("Error decoding log:", error);
        }
      }
      return undefined;
    })
    .filter((value): value is bigint => value !== undefined);
};
