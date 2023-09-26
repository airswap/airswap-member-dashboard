import { ReactNode } from "react";
import { twJoin } from "tailwind-merge";
import { useQuery, useWaitForTransaction } from "wagmi";
import loadingSpinner from "../../assets/loading-spinner.svg";
import { useStakingModalStore } from "../staking/store/useStakingModalStore";
import { transactionTrackerIcon } from "../staking/utils/iconTransactionTracker";
import { Button } from "./Button";
import { EtherscanUrl } from "./EtherscanUrl";

type Status = ReturnType<typeof useQuery>["status"];

type ActionButton = {
  afterSuccess: { label: string; callback: () => void };
  afterFailure: { label: string; callback: () => void };
};

export const TransactionTracker = ({
  actionDescription,
  successText,
  actionButtons,
}: {
  actionDescription?: string;
  successText: string | ReactNode;
  actionButtons?: ActionButton;
}) => {
  const { txHash } = useStakingModalStore();

  const { status, isError } = useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
  });

  const icon = transactionTrackerIcon(status);
  const etherscanUrl = EtherscanUrl(txHash);

  const shouldButtonRender = status === "success" || isError;

  const buttonContents = (status: Status) => {
    switch (status) {
      case "success":
        return {
          text: actionButtons?.afterSuccess.label,
          action: actionButtons?.afterSuccess.callback,
        };
      case "error":
        return {
          text: actionButtons?.afterFailure.label,
          action: actionButtons?.afterFailure.callback,
        };
      default:
        return;
    }
  };
  const buttonContent = buttonContents(status);

  return (
    <div className="flex flex-col items-center text-gray-500 pt-4">
      <div
        className={twJoin(
          icon === loadingSpinner ? "m-auto animate-spin p-0" : "p-2",
          "bg-black rounded-full",
        )}
      >
        {icon && <img src={icon} alt="" />}
      </div>
      {successText && <div className="-mb-6">{successText}</div>}
      <div className="mt-8">{etherscanUrl}</div>
      {actionDescription && (
        <div className="w-full mt-6 p-4 text-center rounded bg-gray-800 text-gray-400 text-sm">
          {actionDescription}
        </div>
      )}
      <div className={twJoin("w-full", shouldButtonRender && "mt-12")}>
        {shouldButtonRender && (
          <Button
            onClick={buttonContent?.action}
            color="primary"
            rounded={false}
            className="w-full"
          >
            {buttonContent?.text}
          </Button>
        )}
      </div>
    </div>
  );
};
