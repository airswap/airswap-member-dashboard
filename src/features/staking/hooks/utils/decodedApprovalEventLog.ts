import { decodeEventLog } from "viem";
import { astAbi } from "../../../../contracts/astAbi";
import { ApprovalLogType } from "../../types/StakingTypes";

export const decodedApprovalEventLog = (logs: ApprovalLogType[]): bigint[] => {
  return logs
    .map((log) => {
      try {
        const decoded = decodeEventLog({
          abi: astAbi,
          eventName: "Approval",
          data: log.data,
          topics: log.topics,
        });

        return decoded.eventName === "Approval"
          ? decoded.args.value
          : undefined;
      } catch (error) {
        console.error("Error decoding log:", error);
        return undefined;
      }
    })
    .filter((value): value is bigint => value !== undefined);
};
