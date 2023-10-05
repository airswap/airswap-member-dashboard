import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { Hash, decodeEventLog, zeroAddress } from "viem";
import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { poolAbi } from "../../contracts/poolAbi";
import { Button } from "../common/Button";
import { TransactionTracker } from "../common/TransactionTracker";
import { useIsSupportedChain } from "../common/hooks/useIsSupportedChain";
import { formatNumber } from "../common/utils/formatNumber";
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

  const [withdrawnAmount, setWithdrawnAmount] = useState<bigint>();
  const [pointsUsed, setPointsUsed] = useState<number>();

  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId: chainId });

  const isSupportedChain = useIsSupportedChain();
  const { switchNetwork, isLoading: switchNetworkLoading } = useSwitchNetwork();

  const [
    pointsClaimableByEpoch,
    allClaims,
    selectedClaims,
    clearSelectedClaims,
    setShowClaimModal,
    setIsClaimLoading,
  ] = useClaimSelectionStore((state) => [
    state.pointsClaimableByEpoch,
    state.allClaims,
    state.selectedClaims,
    state.clearSelectedClaims,
    state.setShowClaimModal,
    state.setIsClaimLoading,
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
    tokenAddress: Hash;
    tokenDecimals: number;
    tokenSymbol: string;
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
    // Don't simulate if we've got a withdrawn amount, because we're
    // showing a tx success for the current claim, so it'll fail.
    enabled: !!selection && !withdrawnAmount,
  });

  const {
    data: writeResult,
    write,
    reset: resetContractWrite,
    isLoading: waitingForSignature,
  } = useContractWrite({
    ...claimTxConfig,
    onSuccess: async (result) => {
      // Find the withdrawn amount.
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });

      resetClaimStatuses();
      clearSelectedClaims();
      refetchClaimable();

      // Reverse because it's likely to be the last one
      for (const log of receipt.logs.reverse()) {
        try {
          const decodedLog = decodeEventLog({
            abi: poolAbi,
            ...log,
          });
          if (decodedLog.eventName === "Withdraw") {
            setWithdrawnAmount(decodedLog.args.amount);
            break;
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    onError: (e) => {
      resetClaimStatuses();
      clearSelectedClaims();
      refetchClaimable();
    },
  });

  const { status: txStatus } = useWaitForTransaction({
    hash: writeResult?.hash,
  });

  const actionButtons = {
    afterFailure: {
      label: "Try again",
      callback: () => {
        resetContractWrite();
      },
    },
    afterSuccess: {
      label: "Close",
      callback: () => {
        setShowClaimModal(false);
      },
    },
  };

  const successContent = withdrawnAmount ? (
    <span>
      You successfully claimed{" "}
      <span className="w-20 text-white">
        {formatNumber(withdrawnAmount, selection?.tokenDecimals)}{" "}
        {selection?.tokenSymbol || "tokens"}
      </span>{" "}
      using {formatNumber(pointsUsed)} points
    </span>
  ) : (
    <span>
      You successfully claimed{" "}
      <span className="inline-block w-14 bg-gray-400 animate-pulse h-3" />
      &nbsp;
      <span className="inline-block w-8 bg-gray-400 animate-pulse h-3" />
      &nbsp;tokens using {formatNumber(pointsUsed)} points
    </span>
  );

  useEffect(() => {
    if (txStatus === "loading" || waitingForSignature) {
      setIsClaimLoading(true);
    } else {
      setIsClaimLoading(false);
    }
  }, [txStatus, setIsClaimLoading, waitingForSignature]);

  return writeResult?.hash || waitingForSignature ? (
    <TransactionTracker
      txHash={writeResult?.hash || undefined}
      actionButtons={actionButtons}
      failureContent="Claim failed"
      successContent={successContent}
      className="w-[304px]"
    />
  ) : (
    <div className="w-[320px] max-h-[300px] flex flex-col">
      <div className="flex-1 overflow-auto [scrollbar-width:thin]">
        <div
          className="grid items-center gap-x-5 gap-y-4 pr-3"
          style={{
            gridTemplateColumns: "auto 1fr auto",
          }}
        >
          {claimable.map(
            ({ claimableAmount, claimableValue, price, tokenInfo }, i) => {
              const isLoaded =
                tokenInfo?.decimals &&
                claimableAmount != null &&
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
                      tokenDecimals: tokenInfo.decimals || 18,
                      tokenSymbol: tokenInfo.symbol || "",
                    });
                  }}
                  amount={claimableAmount || 0n}
                  decimals={tokenInfo?.decimals || 18}
                  symbol={tokenInfo?.symbol || "Tokens"}
                  value={claimableValue || 0}
                  key={tokenInfo?.address || i}
                />
              ) : (
                <ClaimableTokensLineItemLoading key={i + "-loading"} />
              );
            },
          )}
        </div>
      </div>
      {isSupportedChain ? (
        <Button
          color="primary"
          rounded={false}
          className="mt-7"
          onClick={() => {
            if (write) {
              write();
              setPointsUsed(pointsSelected);
            }
          }}
          disabled={selection === undefined || !write}
        >
          Claim
        </Button>
      ) : (
        <Button
          color="primary"
          rounded={false}
          className="mt-7"
          disabled={switchNetworkLoading || !switchNetwork}
          onClick={() => {
            switchNetwork?.(1);
          }}
        >
          Switch to Ethereum
        </Button>
      )}
    </div>
  );
};
