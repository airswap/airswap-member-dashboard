import { IoMdOpen } from "react-icons/io";

export const EtherscanUrl = (link: string) => {
  return (
    <a
      href={link}
      target="_"
      className="flex flex-row items-center text-font-darkSubtext"
    >
      <span className="mr-1">View on Etherscan</span>
      <IoMdOpen />
    </a>
  );
};
