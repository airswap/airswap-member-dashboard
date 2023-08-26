import { FC } from "react";
import { twJoin } from "tailwind-merge";
import loadingSpinner from "../../../assets/loading-spinner.svg";
import { WagmiLoadingStatus } from "../types/StakingTypes";

interface PendingTransactionProps {
  statusApprove: WagmiLoadingStatus;
  statusStaking: WagmiLoadingStatus;
  statusUnstake: WagmiLoadingStatus;
}

const PendingTransaction: FC<PendingTransactionProps> = ({
  statusApprove,
  statusStaking,
  statusUnstake,
}) => {
  const subheading = () => {
    if (statusApprove === "loading") {
      return "Token approval pending";
    } else if (statusStaking === "loading" || statusUnstake === "loading") {
      ("Transaction sign pending");
    }
  };

  const message = () => {
    if (statusApprove === "loading") {
      return "To stake your AST you will have to approve the token spent. Please the transaction in your wallet, your wallet should open. If your wallet doesn't open please try again.";
    } else if (statusStaking === "loading") {
      return "To stake your AST please sign the transaction in your wallet. Your wallet should open, if your wallet doesn’t open please try again.";
    } else if (statusUnstake === "loading") {
      return "Your transaction to unstake sAST is pending. Please wait a moment.";
    }
  };
  const displayMessage = message();

  return (
    <>
      <div className="flex flex-col">
        <div className="m-auto animate-spin p-2">
          <img src={loadingSpinner} alt="loading spinner" />
        </div>
        <div className="m-auto my-6">
          <h3>{subheading()}</h3>
        </div>
        <div
          className={twJoin(
            "rounded px-4 py-3 text-sm",
            "dark:bg-bg-darkShaded",
          )}
        >
          {displayMessage}
        </div>
      </div>
    </>
  );
};

export default PendingTransaction;
