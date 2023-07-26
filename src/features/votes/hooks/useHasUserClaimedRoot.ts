import { useAccount, useQuery } from "wagmi";

export const useHasUserClaimedRoot = ({
  root,
  voterAddress,
}: {
  root: string;
  voterAddress: string;
}) => {
  const { address: connectedAccount } = useAccount();
  const address = voterAddress || connectedAccount;

  const fetch = () => {
    return true;
  };

  // TODO: when we have the abi, this will be a `claimed(root, address)`
  // useContractRead call.
  return useQuery(["TODO: REMOVE"], {
    enabled: false,
  });
};
