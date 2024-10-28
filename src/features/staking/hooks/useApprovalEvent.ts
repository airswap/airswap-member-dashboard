import { useContractEvent } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";
import { useStakingModalStore } from "../store/useStakingModalStore";
import { ApprovalLogType } from "../types/StakingTypes";
import { decodedEventLog } from "../utils/decodeEventLog";

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
    listener(log) {
      console.log("Raw log:", log);

      const approvalValue = decodedEventLog(log as ApprovalLogType);
      console.log("Decoded approvalValue:", approvalValue);

      if (approvalValue) {
        setApprovalEventLog(approvalValue);
      }
    },
  });
};
