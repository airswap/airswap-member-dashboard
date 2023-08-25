import { FC } from "react";
import { IoMdOpen } from "react-icons/io";
import greenCheck from "../../../assets/check-green.svg";
import { StakingStatus } from "../types/StakingTypes";
import { etherscanLink } from "../utils/helpers";

interface ApproveSuccessProps {
  stakeOrUnstake: "stake" | "unstake";
  statusStaking: StakingStatus;
  amountApproved?: string;
  amountStaked?: string;
  amountUnstaked?: string;
  chainId: number;
  transactionHashApprove?: string | undefined;
  transactionHashStake?: string | undefined;
  transactionHashUnstake?: string | undefined;
}

const ApproveSuccess: FC<ApproveSuccessProps> = ({
  stakeOrUnstake,
  statusStaking,
  amountApproved,
  amountStaked,
  amountUnstaked,
  chainId,
  transactionHashApprove,
  transactionHashStake,
  transactionHashUnstake,
}) => {
  const handleMessage = () => {
    if (stakeOrUnstake === "stake") {
      if (statusStaking === "approved") {
        return "You've successfully approved";
      } else if (statusStaking === "success") {
        return "You've successfully staked";
      }
    } else {
      return "You've successfully unstaked";
    }
  };
  const message = handleMessage();

  const handleStakingUnstakingOrApprovalAmount = () => {
    if (stakeOrUnstake === "stake") {
      switch (statusStaking) {
        case "approved":
          return amountApproved;
        case "success":
          return amountStaked;
      }
    } else if (stakeOrUnstake === "unstake") {
      return amountUnstaked;
    }
  };
  const stakingUnstakingOrApprovalAmount =
    handleStakingUnstakingOrApprovalAmount();

  const asset = stakeOrUnstake === "stake" ? "AST" : "sAST";

  const handleBlockExplorerLink = () => {
    let userAction:
      | typeof transactionHashApprove
      | typeof transactionHashStake
      | typeof transactionHashUnstake;
    if (stakeOrUnstake === "stake") {
      statusStaking === "approved"
        ? (userAction = transactionHashApprove)
        : (userAction = transactionHashStake);
    } else if (stakeOrUnstake === "unstake") {
      userAction = transactionHashUnstake;
    }
    return (
      <a href={etherscanLink(chainId || 1, userAction)} target="_">
        <IoMdOpen />
      </a>
    );
  };
  const blockExplorerLink = handleBlockExplorerLink();

  return (
    <div className="flex flex-col items-center p-6">
      <div className="rounded-full border border-border-darkShaded bg-black p-2">
        <img src={greenCheck} alt="green check" />
      </div>
      <div className="my-4 text-font-darkSubtext">
        <span>{message}</span>
        <span className="ml-1 font-medium text-white">
          <span>{stakingUnstakingOrApprovalAmount}</span>
          <span className="ml-1">{asset}</span>
        </span>
      </div>
      <div className="flex items-center text-font-darkSubtext">
        <span>View on Etherscan</span>
        <div className="ml-2">{blockExplorerLink}</div>
      </div>
    </div>
  );
};

export default ApproveSuccess;
