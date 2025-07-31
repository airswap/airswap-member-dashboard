import { GoLinkExternal } from "react-icons/go";
import infiniteInitiate from "../../assets/video/infinite-initiate.mp4"
import ethereumLogo from "../../assets/ethereum.svg"
import { mainnet } from "wagmi";

const url = "https://sepolia.etherscan.io/token/0xf80cd411d49804d4a80bfe3b26dad4679b7918d7";

export const InfiniteInitiate = ({className}: {className?: string}) => {
  return (
    <div className={"relative w-full text-white border border-gray-800 p-6 "}>
      <h3 className="uppercase font-medium leading-4">Infinite Initiate</h3>
      <div className="flex items-center gap-2 mt-1 text-gray-400">
        <img src={ethereumLogo} alt="Ethereum" className="w-4 h-4" />
        ERC-1150
        <a className="hover:text-white focus:text-white" href={url} target="_blank" rel="noopener noreferrer">
          <GoLinkExternal />
        </a>
      </div>
      <video className="mt-4 w-full aspect-square" src={infiniteInitiate} autoPlay loop muted />
    </div>
  )
};