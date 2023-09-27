import { MdLaunch } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { useNetwork } from "wagmi";
import { etherscanLink } from "../staking/utils/etherscanLink";

export const ViewOnEtherscanLink = ({
  txHash,
  className,
}: {
  txHash: `0x${string}`;
  className?: string;
}) => {
  const { chain } = useNetwork();
  const blockExplorerLink = etherscanLink(chain?.id, txHash);

  return (
    <a
      href={blockExplorerLink}
      target="_"
      className={twMerge(
        "flex flex-row items-center text-gray-500 text-sm",
        className,
      )}
    >
      <span className="mr-2">View on Etherscan</span>
      <MdLaunch size={18} />
    </a>
  );
};
