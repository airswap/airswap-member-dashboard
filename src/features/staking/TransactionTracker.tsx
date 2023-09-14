import { Dispatch, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Hash, TransactionReceipt } from "viem";
import { useNetwork } from "wagmi";
import greenCheck from "../../../src/assets/check-green.svg";
import closeRed from "../../../src/assets/close-red.svg";
import loadingSpinner from "../../../src/assets/loading-spinner.svg";
import { EtherscanUrl } from "../common/EtherscanUrl";
import { trackerStatusTransactionType } from "../votes/utils/trackerStatusTransactionType";
import { StakeOrUnstake, Status, TransactionState } from "./types/StakingTypes";
import { etherscanLink } from "./utils/etherscanLink";
import { transactionTrackerMessages } from "./utils/transactionTrackerMessages";

export const TransactionTracker = ({
  stakeOrUnstake,
  trackerStatus,
  setTrackerStatus,
  stakingAmount,
  statusApprove,
  statusStake,
  statusUnstake,
  isErrorApprove,
  isErrorStake,
  isErrorUnstake,
  transactionHashApprove,
  transactionHashStake,
  transactionHashUnstake,
}: {
  stakeOrUnstake: StakeOrUnstake;
  trackerStatus: TransactionState;
  setTrackerStatus: Dispatch<TransactionState>;
  stakingAmount: string;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
  isErrorApprove: boolean;
  isErrorStake: boolean;
  isErrorUnstake: boolean;
  transactionHashApprove: TransactionReceipt | undefined;
  transactionHashStake: TransactionReceipt | undefined;
  transactionHashUnstake: TransactionReceipt | undefined;
}) => {
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(
    undefined,
  );
  const { chain } = useNetwork();

  const isError = isErrorApprove || isErrorStake || isErrorUnstake;
  // Only display "amount staked" etc, if transaction is successful
  const transactionSuccess =
    statusApprove === "success" ||
    statusStake === "success" ||
    statusUnstake === "success";

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
    // set status of component
    trackerStatusTransactionType({
      statusApprove,
      statusStake,
      statusUnstake,
      isError,
      setTrackerStatus,
    });

    // set etherscan URL
    if (transactionHashApprove) {
      setTransactionHash(transactionHashApprove.transactionHash);
    } else if (transactionHashStake) {
      setTransactionHash(transactionHashStake.transactionHash);
    } else if (transactionHashUnstake) {
      setTransactionHash(transactionHashUnstake.transactionHash);
    }
  }, [
    statusApprove,
    statusStake,
    statusUnstake,
    isError,
    setTrackerStatus,
    transactionHashApprove,
    transactionHashStake,
    transactionHashUnstake,
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
        {/* <span className="flex flex-row"> */}
        <span>{message}</span>
        {transactionSuccess ? (
          <span className="ml-2 font-medium text-white">
            <span>{stakingAmount}</span>
            <span className="ml-1">{asset}</span>
          </span>
        ) : null}
        {/* </span> */}
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
