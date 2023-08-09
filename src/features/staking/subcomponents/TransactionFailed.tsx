import { Dispatch, FC } from "react";
import { IoMdOpen } from "react-icons/io"
import { etherscanLink } from "../../../utils/constants";
import closeRed from "../../../assets/close-red.svg"
import { StatusStaking } from "../types/StakingTypes";
import { twJoin } from "tailwind-merge";

interface TransactionFailedProps {
  setStatusStaking: Dispatch<StatusStaking>;
  chainId: number;
  transactionHash?: string | undefined;
}

const TransactionFailed: FC<TransactionFailedProps> = ({
  setStatusStaking,
  chainId,
  transactionHash
}) => {

  const handleCloseMessage = () => {
    setStatusStaking("readyToStake")
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div>
        <img
          src={closeRed} alt="green check"
          onClick={handleCloseMessage}
        />
      </div>
      <div className="mt-4 text-font-darkSubtext">
        Your transaction has failed
      </div>
      <div className="flex items-center m-6">
        <span className="mr-2">View on Etherscan</span>
        <a href={etherscanLink(chainId || 1, transactionHash)}>
          <IoMdOpen />
        </a>
      </div>
      <div className={twJoin(
        "text-sm py-3 px-4 rounded",
        "dark:bg-bg-darkShaded")}>
        It looks like something went wrong with your transaction, please try again.
      </div>
    </div>
  )
}


export default TransactionFailed
