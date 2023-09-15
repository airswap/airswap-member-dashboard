import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Hash } from "viem";
import { useNetwork } from "wagmi";
import greenCheck from "../../../src/assets/check-green.svg";
import closeRed from "../../../src/assets/close-red.svg";
import loadingSpinner from "../../../src/assets/loading-spinner.svg";
import { EtherscanUrl } from "../common/EtherscanUrl";
import { handleTrackerStatus } from "../votes/utils/handleTrackerStatus";
import { useStakingModalStore } from "./store/useStakingModalStore";
import {
  StakeOrUnstake,
  TransactionErrorLookup,
  TransactionHashLookup,
  TransactionStatusLookup,
} from "./types/StakingTypes";
import { etherscanLink } from "./utils/etherscanLink";
import { transactionTrackerMessages } from "./utils/transactionTrackerMessages";

export const TransactionTracker = ({
  stakingAmount,
  transactionStatusLookup,
  transactionHashLookup,
  transactionErrorLookup,
}: {
  stakingAmount: string;
  transactionStatusLookup: TransactionStatusLookup;
  transactionHashLookup: TransactionHashLookup;
  transactionErrorLookup: TransactionErrorLookup;
}) => {
  const [stakeOrUnstake, trackerStatus, setTrackerStatus] =
    useStakingModalStore((state) => [
      state.stakeOrUnstake,
      state.trackerStatus,
      state.setTrackerStatus,
    ]);
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(
    undefined,
  );
  const { chain } = useNetwork();

  const isError =
    transactionErrorLookup.isErrorApprove ||
    transactionErrorLookup.isErrorStake ||
    transactionErrorLookup.isErrorUnstake;

  handleTrackerStatus({
    transactionStatusLookup,
    isError,
    setTrackerStatus,
  });

  const transactionSuccess =
    transactionStatusLookup.statusApprove === "success" ||
    transactionStatusLookup.statusStake === "success" ||
    transactionStatusLookup.statusUnstake === "success";

  const asset = stakeOrUnstake === StakeOrUnstake.STAKE ? "AST" : "sAST";

  const message = transactionTrackerMessages[trackerStatus].message;
  const description = transactionTrackerMessages[trackerStatus].description;

  const shouldRenderEtherscanUrl = transactionSuccess || isError;

  const blockExplorerLink = etherscanLink(chain?.id, transactionHash);
  const etherscanUrl = EtherscanUrl(blockExplorerLink);

  const statusIconMap: { [k: string]: string } = {
    ApprovePending: loadingSpinner,
    ApproveSuccess: greenCheck,
    StakePending: loadingSpinner,
    StakeSuccess: greenCheck,
    UnstakePending: loadingSpinner,
    UnstakeSuccess: greenCheck,
    Failed: closeRed,
  };
  const icon = statusIconMap[trackerStatus];

  useEffect(() => {
    // handleTrackerStatus({
    //   transactionStatusLookup,
    //   isError,
    //   setTrackerStatus,
    // });

    // set etherscan URL
    if (transactionHashLookup.transactionHashApprove) {
      setTransactionHash(
        transactionHashLookup.transactionHashApprove.transactionHash,
      );
    } else if (transactionHashLookup.transactionHashStake) {
      setTransactionHash(
        transactionHashLookup.transactionHashStake.transactionHash,
      );
    } else if (transactionHashLookup.transactionHashUnstake) {
      setTransactionHash(
        transactionHashLookup.transactionHashUnstake.transactionHash,
      );
    }
  }, [
    transactionStatusLookup.statusApproveAst,
    transactionHashLookup.transactionHashApprove,
    transactionHashLookup.transactionHashStake,
    transactionHashLookup.transactionHashUnstake,
    transactionStatusLookup,
    isError,
    setTrackerStatus,
  ]);

  return (
    <div
      className={twJoin([
        "flex flex-col items-center text-gray-500 pt-4 pb-6",
        `${trackerStatus === "Idle" && "hidden"}`,
      ])}
    >
      <div
        className={twJoin(
          `${!icon && "none"}`,
          icon === loadingSpinner ? "m-auto animate-spin p-0" : "p-2",
          "bg-black rounded-full",
        )}
      >
        <img src={icon} alt={icon} />
      </div>
      <div className="flex flex-row my-4 flex-wrap">
        <span>{message}</span>
        {transactionSuccess ? (
          <span className="ml-2 font-medium text-white">
            <span>{stakingAmount}</span>
            <span className="ml-1">{asset}</span>
          </span>
        ) : null}
      </div>
      {shouldRenderEtherscanUrl ? <div>{etherscanUrl}</div> : null}
      <div
        className={twJoin(
          "rounded px-4 py-3 text-sm bg-gray-800 text-gray-400",
          `${transactionSuccess ? "hidden" : null}`,
        )}
      >
        {description}
      </div>
    </div>
  );
};
