import { FC, useEffect, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Hash, TransactionReceipt } from "viem";
import { useNetwork } from "wagmi";
import greenCheck from "../../../src/assets/check-green.svg";
import closeRed from "../../../src/assets/close-red.svg";
import loadingSpinner from "../../../src/assets/loading-spinner.svg";
import { EtherscanUrl } from "../common/EtherscanUrl";
import { LineBreak } from "../common/LineBreak";
import { StakeOrUnstake, Status } from "./types/StakingTypes";
import { etherscanLink } from "./utils/helpers";
import {
  TransactionTrackerHeadline,
  transactionTrackerDescription,
  transactionTrackerMessages,
} from "./utils/transactionTrackerMessages";

type TransactionTrackerStatus =
  | "ApprovePending"
  | "ApproveSuccess"
  | "StakePending"
  | "StakeSuccess"
  | "UnstakePending"
  | "UnstakeSuccess"
  | "Failed"
  | undefined;

interface TransactionTrackerProps {
  stakeOrUnstake: StakeOrUnstake;
  stakingAmount: string;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
  isErrorArrays: boolean[];
  transactionHashArray: (TransactionReceipt | undefined)[];
}

/**
 *
 * @param stakeOrUnstake indicates user action based on StakeOrUnstake enum
 * @param stakingAmount number string type coming from the input. Same input used for staking and unstaking
 * @param statusApprove indicates if `approve` transaction is taking place
 * @param statusStake indicates if `stake` transaction is taking place
 * @param statusUnstake indicates if `unstake` transaction is taking place
 * @param isErrorArrays array is `isError` boolean returned from useWaitForTransaction wagmi hooks in various custom hooks
 * @param transactionHashArray array of transaction hashes or undefined values. Values originate from `data` return object from useWaitForTransaction wagmi hook, in 'useApproveAst', 'useStakeAst' and 'useUnstakeAst' hooks
 * @returns component which renders state about pending, approved, or failed transactions for approval, staking, or unstaking transactions
 */

export const TransactionTracker: FC<TransactionTrackerProps> = ({
  stakeOrUnstake,
  stakingAmount,
  statusApprove,
  statusStake,
  statusUnstake,
  isErrorArrays,
  transactionHashArray,
}) => {
  const [trackerStatus, setTrackerStatus] =
    useState<TransactionTrackerStatus>(undefined);
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(
    undefined,
  );
  const { chain } = useNetwork();

  const isError = isErrorArrays.some((isError) => isError);

  const asset = stakeOrUnstake === StakeOrUnstake.STAKE ? "AST" : "sAST";

  const headline = trackerStatus && TransactionTrackerHeadline[trackerStatus];

  const message = trackerStatus && transactionTrackerMessages[trackerStatus];

  const description =
    trackerStatus && transactionTrackerDescription[trackerStatus];

  const shouldRenderTokenAmount =
    statusApprove === "success" ||
    statusStake === "success" ||
    statusUnstake === "success";

  const shouldRenderEtherscanUrl = shouldRenderTokenAmount || isError;

  const filterDefinedTransactionHash = useMemo(() => {
    return (
      transactionHashArray.filter(
        (transactionHash: TransactionReceipt | undefined) =>
          transactionHash && !!transactionHash.transactionHash,
      ) || []
    );
  }, [transactionHashArray]);

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
        return "";
    }
  };
  const icon = renderIcon();

  useEffect(() => {
    // set status of component
    if (statusApprove === "loading") {
      setTrackerStatus("ApprovePending");
    } else if (statusApprove === "success") {
      setTrackerStatus("ApproveSuccess");
    } else if (statusStake === "loading") {
      setTrackerStatus("StakePending");
    } else if (statusStake === "success") {
      setTrackerStatus("StakeSuccess");
    } else if (statusUnstake === "loading") {
      setTrackerStatus("UnstakePending");
    } else if (statusUnstake === "success") {
      setTrackerStatus("UnstakeSuccess");
    } else if (isError) {
      setTrackerStatus("Failed");
    } else {
      setTrackerStatus(undefined);
    }

    // set etherscan URL
    if (filterDefinedTransactionHash.length > 0) {
      setTransactionHash(filterDefinedTransactionHash[0]?.transactionHash);
    }
  }, [
    statusApprove,
    statusStake,
    statusUnstake,
    isError,
    filterDefinedTransactionHash,
  ]);

  return (
    <>
      {!trackerStatus ? (
        <div className="flex flex-col items-center p-6">
          <h2 className="font-semibold">{headline}</h2>
          <div className="my-2">
            <LineBreak />
          </div>

          {icon === greenCheck && (
            <div className="rounded-full border border-border-darkShaded bg-black p-2">
              <img src={greenCheck} alt="green check" />
            </div>
          )}
          {icon === loadingSpinner && (
            <div className="m-auto animate-spin p-2">
              <img src={loadingSpinner} alt="loading spinner" />
            </div>
          )}
          {icon === closeRed && (
            <div className="rounded-full border border-border-darkShaded bg-black p-2">
              <img src={closeRed} alt="green check" />
            </div>
          )}

          <div className="my-4 text-font-darkSubtext">
            <span className="flex flex-row">
              <span>{"message"}</span>
              {shouldRenderTokenAmount && (
                <span className="ml-1 font-medium text-white">
                  <span>{stakingAmount}</span>
                  <span className="ml-1">{asset}</span>
                </span>
              )}
            </span>
          </div>
          {shouldRenderEtherscanUrl && <div>{etherscanUrl}</div>}
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
