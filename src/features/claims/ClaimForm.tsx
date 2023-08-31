import BigNumber from "bignumber.js";
import { useState } from "react";
import { zeroAddress } from "viem";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { poolAbi } from "../../contracts/poolAbi";
import { Button } from "../common/Button";
import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";
import { ClaimableTokensLineItem } from "./ClaimableTokensLineItem";
import { useResetClaimStatus } from "./hooks/useResetClaimStatus";

// FIXME: this should not be the source - probably a json file instead,
// with goerli and mainnet.
const stakerTokens: `0x${string}`[] = [
  "0x326c977e6efc84e512bb9c30f76e30c160ed06fb", // link
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // uni
  "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6", // weth
];

export const ClaimForm = ({}: {}) => {
  const [pool] = useContractAddresses([ContractTypes.AirSwapPool], {});
  const { address: connectedAccount } = useAccount();

  const [
    pointsClaimableByEpoch,
    selectedClaims,
    clearSelectedClaims,
    setShowClaimModal,
  ] = useClaimSelectionStore((state) => [
    state.pointsClaimableByEpoch,
    state.selectedClaims,
    state.clearSelectedClaims,
    state.setShowClaimModal,
  ]);

  const resetClaimStatuses = useResetClaimStatus(
    selectedClaims.map((c) => c.tree),
  );

  const totalPointsClaimable = Object.values(pointsClaimableByEpoch).reduce(
    (acc, epoch) => acc + epoch,
    0,
  );

  const pointsSelected = selectedClaims.reduce(
    (acc, { value }) => acc + value,
    0,
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
      selectedClaims.map((claim) => ({
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
    onSuccess(data) {
      resetClaimStatuses();
      clearSelectedClaims();
      setShowClaimModal(false);
      // TODO: show toast.
    },
  });

  const { data, write } = useContractWrite(claimTxConfig);

  const {} = useWaitForTransaction({
    chainId: pool.chainId,
    hash: data?.hash,
  });

  return (
    <div className="flex flex-col w-[304px]">
      <h2 className="font-semibold text-xl mb-1 text-white">Claim</h2>
      <h3 className="text-gray-400">
        Using {pointsSelected} out of {totalPointsClaimable} points
      </h3>

      <hr className="border-gray-800 -mx-6 my-6" />

      <div
        className="grid items-center gap-x-5 gap-y-4"
        style={{
          gridTemplateColumns: "auto 1fr auto",
        }}
      >
        {stakerTokens.map((stakerToken, i) => (
          <ClaimableTokensLineItem
            isSelected={selection?.index === i}
            onSelect={(amount) =>
              setSelection({
                amount,
                index: i,
                tokenAddress: stakerTokens[i],
              })
            }
            numPoints={pointsSelected}
            tokenAddress={stakerToken}
            key={stakerToken}
          />
        ))}
      </div>

      {/* TODO: loading spinner when preparing and claiming */}
      <Button color="primary" rounded={false} className="mt-7" onClick={write}>
        Claim
      </Button>
    </div>
  );
};
