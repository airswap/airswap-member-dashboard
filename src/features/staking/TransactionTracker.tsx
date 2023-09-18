import { ReactNode, useEffect } from "react";
import { twJoin } from "tailwind-merge";
import { Hash } from "viem";
import { useWaitForTransaction } from "wagmi";
import loadingSpinner from "../../assets/loading-spinner.svg";
import { Button } from "../common/Button";
import { EtherscanUrl } from "../common/EtherscanUrl";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { ActionButton, Status } from "./types/StakingTypes";
import { transactionTrackerIcon } from "./utils/iconTransactionTracker";

export const TransactionTracker = ({
  actionDescription,
  successText,
  actionButtons,
  txHash,
}: {
  actionDescription: string | undefined;
  successText: string | ReactNode;
  actionButtons: ActionButton;
  txHash: Hash | undefined;
}) => {
  const { setTxHash } = useStakingModalStore();
  const { data, status, isError } = useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
  });

  const icon = transactionTrackerIcon(status);
  const etherscanUrl = EtherscanUrl(txHash);

  const shouldButtonRender = status === "success" || status === "error";

  const buttonContents = (status: Status) => {
    if (status === "success") {
      return {
        text: actionButtons.afterSuccess.label,
        action: actionButtons.afterSuccess.callback,
      };
    }
    if (status === "error") {
      return {
        text: actionButtons.afterFailure.label,
        action: actionButtons.afterFailure.callback,
      };
    }
  };
  const buttonContent = buttonContents(status);

  useEffect(() => {
    // if txHash exists, update Zustand store
    txHash ? setTxHash(data?.blockHash) : setTxHash(undefined);
  }, [txHash, setTxHash, data]);

  return (
    <div className="flex flex-col items-center text-gray-500 pt-4">
      <div
        className={twJoin(
          icon === loadingSpinner ? "m-auto animate-spin p-0" : "p-2",
          "bg-black rounded-full",
        )}
      >
        {icon && <img src={icon} alt={icon} />}
      </div>
      {successText && <div>{successText}</div>}
      {txHash && <div>{etherscanUrl}</div>}
      {actionDescription && (
        <div className="rounded px-4 py-3 text-sm bg-gray-800 text-gray-400 mt-6 w-full">
          {actionDescription}
        </div>
      )}
      <div className={twJoin("w-full", shouldButtonRender && "mt-12")}>
        {shouldButtonRender ? (
          <Button
            onClick={buttonContent?.action}
            color="primary"
            rounded={false}
            className="w-full"
          >
            {buttonContent?.text}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
