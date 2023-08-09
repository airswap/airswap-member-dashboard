import { FC } from "react"
import { twJoin } from "tailwind-merge";
import loadingSpinner from "../../../assets/loading-spinner.svg"

interface PendingTransactionProps {
  statusStaking: string;
}

const PendingTransaction: FC<PendingTransactionProps> = ({ statusStaking }) => {
  const headline = () => {
    if (statusStaking === "approving") {
      return "Approve token"
    } else if (statusStaking === "staking") {
      return "Sign transaction"
    }
  }

  const message = () => {
    if (statusStaking === "approving") {
      return "To stake your AST you will have to approve the token spent. Please the transaction in your wallet, your wallet should open. If your wallet doesn't open please try again."
    } else if (statusStaking === "staking") {
      return "To stake your AST you will have to approve the token spent. Please the transaction in your wallet, your wallet should open. If your wallet doesn't open, please try again."

    }
  }

  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-semibold">{headline()}</h2>
      </div>
      <div className="flex flex-col">
        <div className="m-auto animate-spin">
          <img src={loadingSpinner} alt="loading spinner" />
        </div>
        <div className="m-auto my-6">Token approval pending</div>
        <div className={twJoin(
          "text-sm py-3 px-4 rounded",
          "dark:bg-bg-darkShaded")}>
          {message()}
        </div>
      </div>
    </>
  )
}

export default PendingTransaction
