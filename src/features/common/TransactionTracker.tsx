import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCheck, MdClose } from "react-icons/md";
import { twJoin, twMerge } from "tailwind-merge";
import { useQuery, useWaitForTransaction } from "wagmi";
import { Button } from "./Button";
import { ViewOnEtherscanLink } from "./ViewOnEtherscanLink";

type Status = ReturnType<typeof useQuery>["status"];

type ActionButtons = {
  afterSuccess: { label: string; callback: () => void };
  afterFailure: { label: string; callback: () => void };
};

export const TransactionTracker = ({
  actionButtons,
  txHash,
  successContent,
  failureContent,
  signatureExplainer,
  className,
}: {
  actionButtons?: ActionButtons;
  /** Note that this will be undefined when the user hasn't signed yet */
  txHash?: `0x${string}`;
  /** Children to display after transaction successful */
  successContent: React.ReactNode;
  /** Children to display after transaction fails */
  failureContent: React.ReactNode;
  /** String to display to explain what the signature is for */
  signatureExplainer?: string;
  className?: string;
}) => {
  const isAwaitingSignature = !txHash;
  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
  });

  // Designs only show the aciton button after success or failure.
  const shouldButtonRender = !isAwaitingSignature && !isLoading;
  const buttonInfo = isSuccess
    ? actionButtons?.afterSuccess
    : actionButtons?.afterFailure;

  const statusContent = isAwaitingSignature
    ? "Waiting for signature"
    : isLoading
    ? "Transaction in progress"
    : isSuccess
    ? successContent
    : failureContent;

  return (
    <div
      className={twMerge(
        "flex flex-col items-center text-gray-500 mt-6",
        className,
      )}
    >
      <div
        className={twJoin(
          "bg-gray-950 border-gray-800 rounded-full w-11 h-11 mb-6",
          "grid place-items-center text-white",
        )}
      >
        {isLoading || isAwaitingSignature ? (
          <AiOutlineLoading3Quarters size={27} className="animate-spin" />
        ) : isSuccess ? (
          <MdCheck size={28} className="text-green-400" />
        ) : (
          <MdClose size={28} className="text-red-600" />
        )}
      </div>

      <div className="text-center">{statusContent}</div>

      {txHash && <ViewOnEtherscanLink txHash={txHash} className="mt-6" />}

      {(isError || isAwaitingSignature) && (
        <div className="p-4 bg-gray-800 text-gray-400 text-xs leading-[18px] rounded mt-6">
          {isError
            ? "It looks like something went wrong with your transaction, please try again."
            : `${
                signatureExplainer ? signatureExplainer + " " : ""
              } Your wallet should open now. Sign the transaction in your wallet. If your wallet doesn't open, please try again.`}
        </div>
      )}

      {shouldButtonRender && buttonInfo && (
        <Button
          onClick={buttonInfo.callback}
          color="primary"
          rounded={false}
          className="w-full mt-10"
        >
          {buttonInfo.label}
        </Button>
      )}
    </div>
  );
};
