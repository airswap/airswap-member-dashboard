import { Dispatch, FC } from "react";
import { IoMdOpen } from "react-icons/io";
import { etherscanLink } from "../../../utils/constants";
import greenCheck from "../../../assets/check-green.svg";
import { StatusStaking } from "../types/StakingTypes";

interface ApproveSuccessProps {
  statusStaking: StatusStaking;
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
  transactionHashStake,
}) => {
  const handleCloseMessage = () => {
    if (statusStaking === "approved") {
      setStatusStaking("readyToStake");
    } else if (statusStaking === "success") {
      setStatusStaking("unapproved");
    }
  };

  const message = () => {
    if (statusStaking === "approved") {
      return "You successfully approved";
    } else if (statusStaking === "success") {
      return "You successfully staked";
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="rounded-full border border-border-darkShaded bg-black p-2">
        <img src={greenCheck} alt="green check" onClick={handleCloseMessage} />
      </div>
      <div className="my-4 text-font-darkSubtext">
        <span>{message()}</span>
        <span className="ml-1 font-medium text-white">
          <span>
            {statusStaking === "approved" ? amountApproved : amountStaked}
          </span>
          <span className="ml-1">AST</span>
        </span>
      </div>
      <div className="flex items-center text-font-darkSubtext">
        <span>View on Etherscan</span>
        <div className="ml-2">
          {statusStaking === "approved" && (
            <a
              href={etherscanLink(chainId || 1, transactionHashApprove)}
              target="_"
            >
              <IoMdOpen />
            </a>
          )}
          {statusStaking === "staking" && (
            <a
              href={etherscanLink(chainId || 1, transactionHashStake)}
              target="_"
            >
              <IoMdOpen />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveSuccess;
