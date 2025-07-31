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
import { minterAbi } from "../../contracts/minterAbi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { TransactionTracker } from "../common/TransactionTracker";
import { requiredBalanceForNftClaim } from "./config";
import { useNftInfo } from "./hooks/useNftInfo";
import { InfiniteInitiate } from "./InfiniteInitiate";
import { useClaimNftStore } from "./store/useClaimNftStore";

const nftAddress = "0xf80cd411d49804d4a80bfe3b26dad4679b7918d7";

export const ClaimNftRewardForm = () => {
	const [pool] = useContractAddresses([ContractTypes.AirSwapPool], {});
	const { address: connectedAccount } = useAccount();

	const chainId = useChainId();
	const publicClient = usePublicClient({ chainId: chainId });

	const { sAstBalanceRaw, sAstBalanceV4_DeprecatedRaw } = useTokenBalances();

	const totalSastBalance = sAstBalanceRaw + sAstBalanceV4_DeprecatedRaw;
	const isBalanceEnough =
		!!totalSastBalance && totalSastBalance >= requiredBalanceForNftClaim;

	const [showClaimNftModal, setShowClaimNftModal, setIsClaimLoading] =
		useClaimNftStore((state) => [
			state.showClaimNftModal,
			state.setShowClaimNftModal,
			state.setIsClaimLoading,
		]);

	const { data: nftInfo } = useNftInfo({ address: nftAddress, id: 0n });

	const { config: mintTxConfig } = usePrepareContractWrite({
		...pool,
		abi: minterAbi,
		functionName: "mintNFT",
		enabled: isBalanceEnough,
	});

	const {
		data: writeResult,
		write,
		reset: resetContractWrite,
		isLoading: waitingForSignature,
	} = useContractWrite({
		...mintTxConfig,
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
				setShowClaimNftModal(false);
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
			failureContent="The claim transaction failed"
			successContent="You have claimed your NFT"
			className="w-[304px]"
		/>
	) : (
		<div className="w-[320px]">
			<InfiniteInitiate />

			<Button
				className="mt-4 w-full"
				color="primary"
				rounded={false}
				onClick={() => write?.()}
				disabled={isBalanceEnough || !write}
			>
				Claim
			</Button>
		</div>
	);
};
