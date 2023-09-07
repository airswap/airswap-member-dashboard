import { FC } from "react";
import { IoMdOpen } from "react-icons/io";
import greenCheck from "../../../assets/check-green.svg";
import { StakeOrUnstake, Status } from "../types/StakingTypes";
import { etherscanLink } from "../utils/helpers";

interface ApproveSuccessProps {
  stakeOrUnstake: StakeOrUnstake;
  statusUnstake: Status;
  amount: string;
  chainId: number;
  transactionHashStake?: string | undefined;
  transactionHashUnstake?: string | undefined;
}

export const ApproveSuccess: FC<ApproveSuccessProps> = ({
  stakeOrUnstake,
  amount,
  chainId,
  transactionHashStake,
  transactionHashUnstake,
}) => {
  const message =
    stakeOrUnstake === StakeOrUnstake.STAKE
      ? "You've successfully staked"
      : "You've successfully unstaked";

  const asset = stakeOrUnstake === StakeOrUnstake.STAKE ? "AST" : "sAST";

  const handleBlockExplorerLink = () => {
    const userAction = StakeOrUnstake.STAKE
      ? transactionHashStake
      : transactionHashUnstake;

    return (
      <a
        href={etherscanLink(chainId || 1, userAction)}
        target="_"
        className="flex flex-row items-center text-font-darkSubtext"
      >
        <span className="mr-1">View on Etherscan</span>
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
          <span>{amount}</span>
          <span className="ml-1">{asset}</span>
        </span>
      </div>
      <div>{blockExplorerLink}</div>
    </div>
  );
};
