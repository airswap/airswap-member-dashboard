// FIXME: this should not be the source - probably a json file instead,

import { useState } from "react";
import { useAccount } from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { Button } from "../common/Button";
import { useEpochSelectionStore } from "../votes/store/useEpochSelectionStore";
import { ClaimableTokensLineItem } from "./ClaimableTokensLineItem";

// with goerli and mainnet.
const stakerTokens: `0x${string}`[] = [
  "0x326c977e6efc84e512bb9c30f76e30c160ed06fb", // link
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // uni
  "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6", // weth
];

export const ClaimForm = ({}: {}) => {
  const [pool] = useContractAddresses([ContractTypes.AirSwapPool], {});
  const { address: connectedAccount } = useAccount();

  const [pointsClaimableByEpoch, selectedEpochs] = useEpochSelectionStore(
    (state) => [state.pointsClaimableByEpoch, state.selectedEpochs],
  );

  const totalPointsClaimable = Object.values(pointsClaimableByEpoch).reduce(
    (acc, epoch) => acc + epoch,
    0,
  );

  const pointsSelected = selectedEpochs.length
    ? selectedEpochs.reduce(
        (acc, epoch) => acc + pointsClaimableByEpoch[epoch],
        0,
      )
    : totalPointsClaimable;

  // TODO: generate proofs. Will need to refactor proof hook to accept multiple.
  const proofs: {
    tree: `0x${string}`;
    value: bigint;
    proof: `0x${string}`[];
  }[] = [
    {
      proof: ["0x123"],
      value: 1n,
      tree: "0x123",
    },
  ];

  const [selectedClaim, setSelectedClaim] = useState<{
    index: number;
    tokenAddress: `0x${string}`;
    amount: bigint;
  }>();

  // const { config } = usePrepareContractWrite({
  //   ...pool,
  //   abi: poolAbi,
  //   functionName: "withdraw",
  //   args: [
  //     // claims
  //     proofs,
  //     selectedClaim!.tokenAddress,
  //     selectedClaim!.amount,
  //     connectedAccount!,
  //   ],
  // });

  return (
    <div className="flex flex-col w-[304px]">
      <h2 className="font-semibold text-xl mb-1">Claim</h2>
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
            isSelected={selectedClaim?.index === i}
            onSelect={(amount) =>
              setSelectedClaim({
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

      <Button color="primary" rounded={false} className="mt-7">
        Claim
      </Button>
    </div>
  );
};
