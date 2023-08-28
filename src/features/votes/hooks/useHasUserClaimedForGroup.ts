import { useQuery } from "wagmi";

export const useHasUserClaimerForGroup = ({
}: {
  root: string;
  voterAddress: string;
}) => {
  // TODO: when we have the abi, this will be a `claimed(root, address)`
  // useContractRead call.
  return useQuery(["TODO: REMOVE"], {
    enabled: false,
  });
};
