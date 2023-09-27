import BigNumber from "bignumber.js";
import { useState } from "react";
import { zeroAddress } from "viem";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { poolAbi } from "../../contracts/poolAbi";
import { Button } from "../common/Button";
import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";
import {
  ClaimableTokensLineItem,
  ClaimableTokensLineItemLoading,
} from "./ClaimableTokensLineItem";
import { useClaimableAmounts } from "./hooks/useClaimableAmounts";
import { useResetClaimStatus } from "./hooks/useResetClaimStatus";

export const ClaimForm = ({}: {}) => {
  const [pool] = useContractAddresses([ContractTypes.AirSwapPool], {});
  const { address: connectedAccount } = useAccount();

  const [
    pointsClaimableByEpoch,
    allClaims,
    selectedClaims,
    clearSelectedClaims,
    setShowClaimModal,
  ] = useClaimSelectionStore((state) => [
    state.pointsClaimableByEpoch,
    state.allClaims,
    state.selectedClaims,
    state.clearSelectedClaims,
    state.setShowClaimModal,
  ]);

  const _selectedClaims = selectedClaims.length ? selectedClaims : allClaims;

  const resetClaimStatuses = useResetClaimStatus(
    _selectedClaims.map((c) => c.tree),
  );

  const totalPointsClaimable = Object.values(pointsClaimableByEpoch).reduce(
    (acc, epoch) => acc + epoch,
    0,
  );

  const pointsSelected = _selectedClaims.reduce(
    (acc, { value }) => acc + value,
    0,
  );

  const { data: claimable, refetch: refetchClaimable } = useClaimableAmounts(
    pointsSelected || totalPointsClaimable,
  );

  const [selection, setSelection] = useState<{
    index: number;
    tokenAddress: `0x${string}`;
    amount: bigint;
  }>();

  const { config: claimTxConfig } = usePrepareContractWrite({
    ...pool,
    abi: poolAbi,
    functionName: "withdraw",
    args: [
      // claims
      _selectedClaims.map((claim) => ({
        ...claim,
        value: BigInt(
          new BigNumber(claim.value).multipliedBy(10 ** 4).toFixed(0),
        ),
      })),
      selection?.tokenAddress || zeroAddress,
      selection?.amount || 0n,
      connectedAccount!,
    ],
    enabled: !!selection,
  });

  const { data, write } = useContractWrite({
    ...claimTxConfig,
    onSuccess: () => {
      resetClaimStatuses();
      clearSelectedClaims();
      refetchClaimable();
      setShowClaimModal(false);
      // TODO: Use new transaction tracker.
    },
  });

  return (
    <div className="flex flex-col w-[304px]">
      <div
        className="grid items-center gap-x-5 gap-y-4"
        style={{
          gridTemplateColumns: "auto 1fr auto",
        }}
      >
        {claimable.map(
          ({ claimableAmount, claimableValue, price, tokenInfo }, i) => {
            const isLoaded =
              tokenInfo?.decimals &&
              claimableAmount &&
              price &&
              tokenInfo.symbol;

            return isLoaded ? (
              <ClaimableTokensLineItem
                isSelected={selection?.index === i}
                onSelect={() => {
                  if (!claimableAmount || !tokenInfo?.address) return;
                  setSelection({
                    amount: claimableAmount,
                    index: i,
                    tokenAddress: tokenInfo.address,
                  });
                }}
                amount={claimableAmount || 0n}
                decimals={tokenInfo?.decimals || 18}
                symbol={tokenInfo?.symbol || "N/A"}
                value={claimableValue || 0}
                key={tokenInfo?.address || i}
              />
            ) : (
              <ClaimableTokensLineItemLoading key={i + "-loading"} />
            );
          },
        )}
      </div>

      <Button color="primary" rounded={false} className="mt-7" onClick={write}>
        Claim
      </Button>
    </div>
  );
};
