import { useEffect, useState } from "react";
import { useContractEvent } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";
import { useStakingModalStore } from "../store/useStakingModalStore";
import { decodedApprovalEventLog } from "./utils/decodedApprovalEventLog";

export const useApprovalEvent = () => {
  const [approvalLog, setApprovalLog] = useState<undefined | any>(undefined);
  const [decodedValue, setDecodedValue] = useState<bigint | undefined>(
    undefined,
  );
  const { setApprovalEventLog } = useStakingModalStore();

  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  useContractEvent({
    address: airSwapToken.address,
    abi: astAbi,
    eventName: "Approval",
    listener: (log) => {
      setApprovalLog(log);
    },
  });

  useEffect(() => {
    if (approvalLog) {
      const decodedValues = decodedApprovalEventLog(approvalLog);
      setDecodedValue(decodedValues[decodedValues.length - 1]);

      setApprovalEventLog(approvalLog);
    }
  }, [approvalLog, setApprovalEventLog]);

  return decodedValue;
};
