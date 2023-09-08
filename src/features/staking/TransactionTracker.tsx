import { FC, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Hash, TransactionReceipt } from "viem";
import { useNetwork } from "wagmi";
import greenCheck from "../../../src/assets/check-green.svg";
import closeRed from "../../../src/assets/close-red.svg";
import loadingSpinner from "../../../src/assets/loading-spinner.svg";
import { EtherscanUrl } from "../common/EtherscanUrl";
import { LineBreak } from "../common/LineBreak";
import { trackerStatusTransactionType } from "../votes/utils/trackerStatusTransactionType";
import {
  StakeOrUnstake,
  Status,
  TransactionTrackerStatus,
} from "./types/StakingTypes";
import { etherscanLink } from "./utils/etherscanLink";
import {
  TransactionTrackerHeadline,
  transactionTrackerDescription,
  transactionTrackerMessages,
} from "./utils/transactionTrackerMessages";

interface TransactionTrackerProps {
  stakeOrUnstake: StakeOrUnstake;
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
}

/**
 *
 * @param stakeOrUnstake indicates user action based on StakeOrUnstake enum
 * @param stakingAmount number string type coming from the input. Same input used for staking and unstaking
 * @param statusApprove indicates if `approve` transaction is taking place
 * @param statusStake indicates if `stake` transaction is taking place
 * @param statusUnstake indicates if `unstake` transaction is taking place
 * @param isErrorApprove boolean indicates if `approve` function returns error
 * @param isErrorStake boolean indicates if `stake` function returns error
 * @param isErrorUnstake boolean indicates if `unstake` function returns error
 * @param transactionHashApprove returns an object containing transaction hash from `approve` function
 * @param transactionHashStake returns an object containing transaction hash from `stake` function
 * @param transactionHashUnstake returns an object containing transaction hash from `unstake` function
 * @returns component which renders state about pending, approved, or failed transactions for approval, staking, or unstaking transactions
 */

export const TransactionTracker: FC<TransactionTrackerProps> = ({
  stakeOrUnstake,
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
}) => {
  const [trackerStatus, setTrackerStatus] = useState<
    TransactionTrackerStatus | undefined
  >(undefined);
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(
    undefined,
  );
  const { chain } = useNetwork();

  const isError = isErrorApprove || isErrorStake || isErrorUnstake;

  const asset = stakeOrUnstake === StakeOrUnstake.STAKE ? "AST" : "sAST";

  const headline = trackerStatus && TransactionTrackerHeadline[trackerStatus];
  const message = trackerStatus && transactionTrackerMessages[trackerStatus];
  const description =
    trackerStatus && transactionTrackerDescription[trackerStatus];

  // Only display "amount staked" etc, if transaction is successful
  const shouldRenderTokenAmount =
    statusApprove === "success" ||
    statusStake === "success" ||
    statusUnstake === "success";

  const shouldRenderEtherscanUrl = shouldRenderTokenAmount || isError;

  const blockExplorerLink = etherscanLink(chain?.id, transactionHash);
  const etherscanUrl = EtherscanUrl(blockExplorerLink);

  const renderIcon = () => {
    switch (trackerStatus) {
      case "ApprovePending":
        return loadingSpinner;
      case "ApproveSuccess":
        return greenCheck;
      case "StakePending":
        return loadingSpinner;
      case "StakeSuccess":
        return greenCheck;
      case "UnstakePending":
        return loadingSpinner;
      case "UnstakeSuccess":
        return greenCheck;
      case "Failed":
        return closeRed;
      default:
        return undefined;
    }
  };
  const icon = renderIcon();

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
    transactionHashApprove,
    transactionHashStake,
    transactionHashUnstake,
  ]);

  return (
    <>
      {trackerStatus ? (
        <div className="flex flex-col items-center px-6">
          <h2 className="font-semibold">{headline}</h2>
          <div className="my-2">
            <LineBreak />
          </div>

          <div
            className={twJoin([
              `${icon && "none"}`,
              "rounded-full border border-border-darkShaded bg-black p-2 mt-6",
              `${icon === loadingSpinner && "m-auto animate-spin"}`,
            ])}
          >
            <img src={icon} alt={icon?.toString()} />
          </div>

          <div className="my-4 text-font-darkSubtext">
            <span className="flex flex-row">
              <span>{message}</span>
              {shouldRenderTokenAmount ? (
                <span className="ml-1 font-medium text-white">
                  <span>{stakingAmount}</span>
                  <span className="ml-1">{asset}</span>
                </span>
              ) : null}
            </span>
          </div>
          {shouldRenderEtherscanUrl ? <div>{etherscanUrl}</div> : null}
          <div
            className={twJoin(
              "rounded px-4 py-3 text-sm",
              "dark:bg-bg-darkShaded",
            )}
          >
            {description}
          </div>
        </div>
      ) : null}
    </>
  );
};
