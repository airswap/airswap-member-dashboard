import { twJoin } from "tailwind-merge";
import { useQuery, useWaitForTransaction } from "wagmi";
import { WriteContractResult } from "wagmi/actions";
import loadingSpinner from "../../assets/loading-spinner.svg";
import { useStakingModalStore } from "../staking/store/useStakingModalStore";
import { AmountStakedText } from "../staking/subcomponents/AmountStakedText";
import { TxType } from "../staking/types/StakingTypes";
import { transactionTrackerIcon } from "../staking/utils/iconTransactionTracker";
import { Button } from "./Button";
import { EtherscanUrl } from "./EtherscanUrl";
import { transactionTextLogic } from "./utils/transactionTextLogic";

type Status = ReturnType<typeof useQuery>["status"];

type ActionButton = {
  afterSuccess: { label: string; callback: () => void };
  afterFailure: { label: string; callback: () => void };
};

export const TransactionTracker = ({
  actionButtons,
  dataApproveAst,
  dataStakeAst,
  dataUnstakeSast,
  stakingAmount = "0",
}: {
  actionButtons?: ActionButton;
  dataApproveAst?: WriteContractResult | undefined;
  dataStakeAst?: WriteContractResult | undefined;
  dataUnstakeSast?: WriteContractResult | undefined;
  stakingAmount?: string;
}) => {
  const { txHash, txType } = useStakingModalStore();

  const { status: txStatus, isError } = useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
  });

  const icon = transactionTrackerIcon(txStatus);
  const etherscanUrl = EtherscanUrl(txHash);

  const shouldButtonRender = txStatus === "success" || isError;

  const successText = AmountStakedText({
    dataApproveAst,
    dataStakeAst,
    dataUnstakeSast,
    txStatus,
  });

  const transactionText = transactionTextLogic({
    dataApproveAst,
    dataStakeAst,
    dataUnstakeSast,
    txStatus,
  });

  const buttonContents = (txStatus: Status) => {
    switch (txStatus) {
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
        return undefined;
    }
  };
  const buttonContent = buttonContents(txStatus);

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
      {successText && (
        <div className="-mb-6">
          <div className={twJoin("flex flex-row my-4 flex-wrap")}>
            <span>{successText}</span>
            <span className="ml-2 font-medium text-white">
              <span>{stakingAmount}</span>
              <span className="ml-1">
                {txType === TxType.STAKE ? "AST" : "sAST"}
              </span>
            </span>
          </div>
        </div>
      )}
      <div className="mt-8">{etherscanUrl}</div>
      {transactionText && (
        <div className="w-full mt-6 p-4 text-center rounded bg-gray-800 text-gray-400 text-sm">
          {transactionText}
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
