import { useState } from "react";
import { Address, isAddress } from "viem";
import { useChainId } from "wagmi";
import { useMultipleTokenInfo } from "../common/hooks/useMultipleTokenInfo";
import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";
import { useClaimableAmounts } from "./hooks/useClaimableAmounts";

export const AddCustomTokenForm = ({ className }: { className?: string }) => {
  const [address, setAddress] = useState<string>("");
  const chainId = useChainId();

  const isValidAddress = isAddress(address || "");

  const [{ data: tokenInfo, isError }] = useMultipleTokenInfo({
    chainId,
    tokenAddresses: [address as Address],
    enabled: isValidAddress,
  });

  const { addCustomToken, selectedClaims, pointsClaimableByEpoch } =
    useClaimSelectionStore((state) => ({
      addCustomToken: state.addCustomToken,
      selectedClaims: state.selectedClaims,
      pointsClaimableByEpoch: state.pointsClaimableByEpoch,
    }));

  const totalPointsClaimable = Object.values(pointsClaimableByEpoch).reduce(
    (acc, epoch) => acc + epoch,
    0,
  );

  const pointsSelected =
    selectedClaims.reduce((acc, claim) => acc + claim.value, 0) ||
    totalPointsClaimable;

  const { refetch: refetchClaimable } = useClaimableAmounts(pointsSelected);

  return (
    <div className="flex flex-col">
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="text-black"
      />
      {!isValidAddress && <div className="text-white">Invalid address</div>}
      <div>
        {tokenInfo && (
          <div className="text-white">
            <div>{tokenInfo.name}</div>
            <div>{tokenInfo.symbol}</div>
            <div>{tokenInfo.decimals}</div>
            <button
              onClick={() => {
                addCustomToken(chainId, address as Address);
                refetchClaimable();
                setAddress("");
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
