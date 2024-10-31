import { useContractEvent, useNetwork } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { astAbi } from "../../../contracts/astAbi";
import { useStakingModalStore } from "../store/useStakingModalStore";
import { decodedApprovalEventLog } from "./utils/decodedApprovalEventLog";

export const useApprovalEvent = () => {
  const { chain } = useNetwork();
  const { setApprovalEventLog } = useStakingModalStore();

  const [airSwapToken] = useContractAddresses([ContractTypes.AirSwapToken], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  useContractEvent({
    address: airSwapToken.address,
    abi: astAbi,
    eventName: "Approval",
    listener(log) {
      console.log("start listener LOG");

      // Decode the array of event logs and update Zustand store with each valid decoded value
      const decodedValues = decodedApprovalEventLog(log);
      decodedValues.forEach((value) => {
        setApprovalEventLog(value.toString());
      });
    },
    chainId: chain?.id,
  });
};
