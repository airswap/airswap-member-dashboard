import { BsCircleFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import "../../index.css";
import { calculateTokenProportions } from "./utils/calculateTokenProportions";

export const StakableBar = ({ className }: { className?: string }) => {
  const {
    ustakableSAstBalanceFormatted: unstakable,
    sAstBalanceFormatted: staked,
    astBalanceFormatted: stakable,
  } = useTokenBalances();

  const { unstakablePercent, stakedPercent, stakablePercent } =
    calculateTokenProportions({
      unstakable: +unstakable,
      staked: +staked,
      stakable: +stakable,
    });

  return (
    <div className={twMerge("flex w-full flex-col gap-4", className)}>
      <div className="m-auto flex h-2 mb-2 w-full flex-row rounded-full">
        <div
          style={{ flexBasis: `${unstakablePercent}%` }}
          className="checkered-blue rounded-l-full min-w-[3px]"
        ></div>
        <div
          style={{ flexBasis: `${stakedPercent}%` }}
          className="bg-airswap-blue"
        ></div>
        <div
          style={{ flexBasis: `${stakablePercent}%` }}
          className="rounded-r-full bg-gray-500 min-w[3px]"
        ></div>
      </div>

      {/* TODO: monospaced font for numbers */}
      <div className="flex flex-row items-center leading-none text-[15px]">
        <div className="checkered-blue rounded-full mr-2.5">
          <BsCircleFill className="text-transparent" size={14} />
        </div>
        <span className="font-medium">{unstakable}&nbsp;</span>
        <span className="text-gray-400">unstakable</span>
      </div>
      <div className="flex flex-row items-center leading-none text-[15px]">
        <BsCircleFill className="text-blue-500 mr-2.5" size={14} />
        <span className="font-medium">{staked}&nbsp;</span>
        <span className="text-gray-400">staked</span>
      </div>
      <div className="flex flex-row items-center leading-none text-[15px]">
        <BsCircleFill className="text-gray-500 mr-2.5" size={14} />
        <span className="font-medium">{stakable}&nbsp;</span>
        <span className="text-gray-400">stakable</span>
      </div>
    </div>
  );
};
