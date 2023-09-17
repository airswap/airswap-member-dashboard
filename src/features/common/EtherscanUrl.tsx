import { IoMdOpen } from "react-icons/io";
import { Hash } from "viem";
import { useNetwork } from "wagmi";
import { etherscanLink } from "../staking/utils/etherscanLink";

export const EtherscanUrl = (transactionHash: Hash | undefined) => {
  const { chain } = useNetwork();
  const blockExplorerLink = etherscanLink(chain?.id, transactionHash);

  return (
    <a
      href={blockExplorerLink}
      target="_"
      className="flex flex-row items-center text-font-darkSubtext"
    >
      <span className="mr-1">View on Etherscan</span>
      <IoMdOpen />
    </a>
  );
};
