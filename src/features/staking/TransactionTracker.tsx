import { ReactNode, useEffect } from "react";
import { twJoin } from "tailwind-merge";
import { Hash } from "viem";
import { useWaitForTransaction } from "wagmi";
import loadingSpinner from "../../assets/loading-spinner.svg";
import { Button } from "../common/Button";
import { EtherscanUrl } from "../common/EtherscanUrl";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { ActionButton } from "./types/StakingTypes";
import { transactionTrackerIcon } from "./utils/iconTransactionTracker";

export const TransactionTracker = ({
  actionDescription,
  successText,
  actionButtons,
  stakingAmount,
  txHash,
}: {
  actionDescription: string | ReactNode;
  successText: string | ReactNode;
  actionButtons: ActionButton;
  stakingAmount: string;
  txHash: Hash | undefined;
}) => {
  const { setTxHash } = useStakingModalStore();
  const { data, status, isError } = useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
  });

  const icon = transactionTrackerIcon(status);
  const etherscanUrl = EtherscanUrl(txHash);

  const shouldRenderActionDescription =
    status === "loading" || status === "error";
  const shouldButtonRender = status === "success" || status === "error";

  const buttonContents = () => {
    if (actionDescription === "success") {
      return {
        text: actionButtons.afterSuccess.label,
        action: actionButtons.afterSuccess.callback,
      };
    }
    if (actionDescription === "error") {
      return {
        text: actionButtons.afterFailure.label,
        action: actionButtons.afterFailure.callback,
      };
    }
  };
  const buttonContent = buttonContents();

  useEffect(() => {
    // if txHash exists, update Zustand store
    txHash ? setTxHash(data?.blockHash) : setTxHash(undefined);
  }, [txHash, setTxHash, data]);

  return (
    <div className="flex flex-col items-center text-gray-500 pt-4 pb-6">
      <div
        className={twJoin(
          icon === loadingSpinner ? "m-auto animate-spin p-0" : "p-2",
          "bg-black rounded-full",
        )}
      >
        {icon && <img src={icon} alt={icon} />}
      </div>
      <div className="flex flex-row my-4 flex-wrap">{actionDescription}</div>
      {txHash && <div>{etherscanUrl}</div>}
      <div className="rounded px-4 py-3 text-sm bg-gray-800 text-gray-400">
        {actionDescription}
      </div>
      <div>
        {shouldButtonRender ? (
          <Button
            onClick={buttonContent?.action}
            color="primary"
            rounded={false}
          >
            {buttonContent?.text}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
