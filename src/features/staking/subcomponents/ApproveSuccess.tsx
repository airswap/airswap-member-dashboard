import { Dispatch, FC } from "react";
import { IoMdOpen } from "react-icons/io"
import { etherscanLink } from "../../../utils/constants";
import greenCheck from "../../../assets/check-green.svg"
import { StatusStaking } from "../types/StakingTypes";

interface ApproveSuccessProps {
  statusStaking: string;
  setStatusStaking: Dispatch<StatusStaking>;
  amountApproved?: string;
  amountStaked?: string;
  chainId: number;
  transactionHashApprove?: string | undefined;
  transactionHashStake?: string | undefined;
}

const ApproveSuccess: FC<ApproveSuccessProps> = ({
  statusStaking,
  setStatusStaking,
  amountApproved,
  amountStaked,
  chainId,
  transactionHashApprove,
  transactionHashStake
}) => {
  const handleCloseMessage = () => {
    setStatusStaking("readyToStake")
  }

  const message = () => {
    if (statusStaking === "approving") {
      return "You successfully approved"
    } else if (statusStaking === "staking") {
      return "You successfully staked"
    }
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div>
        <img
          src={greenCheck} alt="green check"
          onClick={handleCloseMessage}
        />
      </div>
      <div className="my-4 text-font-darkSubtext">
        <span>{message()}</span>
        <span className="ml-1 text-white font-medium">
          {statusStaking === "approving" ? amountApproved : amountStaked}
          <span>AST</span>
        </span>
      </div>
      <div className="flex items-center">
        <span>View on Etherscan</span>
        <div className="ml-2">
          {statusStaking === "approving" &&
            <a href={etherscanLink(chainId || 1, transactionHashApprove)}>
              <IoMdOpen />
            </a>
          }
          {statusStaking === "staking" &&
            <a href={etherscanLink(chainId || 1, transactionHashStake)}>
              <IoMdOpen />
            </a>
          }
        </div>
      </div>
    </div>
  )
}


export default ApproveSuccess
