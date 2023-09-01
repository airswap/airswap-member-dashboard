import { useAccount, useContractRead } from "wagmi";
import { AirSwapPoolAbi } from "../../../abi/AirSwapPool";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";

/**
 * Queries the pool contract to see if the provided address is an admin.
 *
 * @param address Optional address, if not provided, uses connected account.
 * If no account is provided and an address isn't provided, the query that this
 * hook returns is disabled.
 * @returns useContractRead query querying the pool for the connected network,
 * defaulting to mainnet.
 */
export const useIsPoolAdmin = (address?: `0x${string}`) => {
  const { address: connectedAccount } = useAccount();
  const [poolContract] = useContractAddresses([ContractTypes.AirSwapPool], {
    alwaysUseDefault: false,
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  const _address = address || connectedAccount;
  const enabled = !!_address && !!poolContract?.address;

  return useContractRead({
    abi: AirSwapPoolAbi,
    address: poolContract?.address,
    chainId: poolContract?.chainId,
    functionName: "admins",
    args: [_address!], // It's okay to assert non-null due to `enabled` check above.
    enabled,
    watch: false,
    cacheTime: 604_800_000, // 1 week in ms
    staleTime: 604_800_000,
  });
};
