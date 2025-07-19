import { useEffect } from "react";
import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { poolAbi } from "../../contracts/poolAbi";
import { Button } from "../common/Button";
import { TransactionTracker } from "../common/TransactionTracker";
import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";
import { useStakesForAccount } from "../staking/hooks/useStakesForAccount";

export const ClaimNftRewardForm = ({}: {}) => {
  const [pool] = useContractAddresses([ContractTypes.AirSwapPool], {});
  const { address: connectedAccount } = useAccount();

  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId: chainId });

  const { sAstBalance } = useStakesForAccount();

  const requiredBalance = 1000000000n;
  const isBalanceEnough = !!sAstBalance && sAstBalance >= requiredBalance;
  
  const [setShowClaimModal, setIsClaimLoading] = useClaimSelectionStore((state) => [
    state.setShowClaimModal,
    state.setIsClaimLoading,
  ]);

  const { config: claimTxConfig } = usePrepareContractWrite({
    ...pool,
    abi: poolAbi,
    // @ts-ignore
    functionName: "claimNftReward",
    args: [],
    enabled: isBalanceEnough,
  });

  const {
    data: writeResult,
    write,
    reset: resetContractWrite,
    isLoading: waitingForSignature,
  } = useContractWrite({
    ...claimTxConfig,
    onSuccess: async (result) => {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });

      // Show claim success
    },
    onError: (e: any) => {
      if (e?.cause?.code === 4001) {
        // Do nothing here, the user rejected the tx
      } else {
        // Show claim failed
      }
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
      successContent="Claim successful"
      className="w-[304px]"
    />
  ) : (
    <div className="w-[320px] max-h-[320px] flex flex-col">
      <div className="flex-1 overflow-auto [scrollbar-width:thin]">
        <div
          className="grid items-center gap-x-5 gap-y-4 pr-3"
          style={{
            gridTemplateColumns: "auto 1fr auto",
          }}
        >
         
        </div>
      </div>

      <Button
        className="mt-2 w-full"
        color="primary"
        rounded={false}
        onClick={() => {
          if (write) {
            write();
          }
        }}
        disabled={isBalanceEnough || !write}
      >
        Claim
      </Button>
    </div>
  );
};
