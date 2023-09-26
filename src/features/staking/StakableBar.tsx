import { BsCircleFill } from "react-icons/bs";
import { twJoin, twMerge } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import "../../index.css";
import { calculateTokenProportions } from "./utils/calculateTokenProportions";

export const StakableBar = ({ className }: { className?: string }) => {
  const {
    unstakableSAstBalanceFormatted: unstakable,
    sAstBalanceFormatted: staked,
    astBalanceFormatted: stakable,
  } = useTokenBalances();

  const { unstakablePercent, stakedPercent, stakablePercent } =
    calculateTokenProportions({
      unstakable: +unstakable,
      staked: +staked,
      stakable: +stakable,
    });

  const zeroBalance = !unstakablePercent && !stakedPercent && !stakablePercent;

  return (
    <div className={twMerge("flex w-full flex-col gap-4", className)}>
      <div className="m-auto flex h-2 mb-2 w-full flex-row rounded-full">
        <div
          style={{ flexBasis: `${unstakablePercent}%` }}
          className={twJoin(
            "checkered-blue rounded-l-full",
            zeroBalance ? "min-w-0" : "min-w-[3px]",
          )}
        ></div>
        <div
          style={{ flexBasis: `${stakedPercent}%` }}
          className="bg-airswap-blue"
        ></div>
        <div
          style={{ flexBasis: `${stakablePercent}%` }}
          className={twJoin(
            "bg-gray-500 min-w[3px]",
            zeroBalance ? "w-full rounded-full" : "rounded-r-full",
          )}
        ></div>
      </div>

      <div className="flex flex-row items-center leading-none text-[15px]">
        <div className="checkered-blue rounded-full mr-2.5">
          <BsCircleFill className="text-transparent" size={14} />
        </div>
        <span className="font-medium font-mono">{unstakable}</span>
        <span className="text-gray-400 relative -top-0.5">
          &nbsp; unstakable
        </span>
      </div>
      <div className="flex flex-row items-center leading-none text-[15px]">
        <BsCircleFill className="text-blue-500 mr-2.5" size={14} />
        <span className="font-medium font-mono">{staked}</span>
        <span className="text-gray-400 relative -top-0.5">&nbsp; staked</span>
      </div>
      <div className="flex flex-row items-center leading-none text-[15px]">
        <BsCircleFill className="text-gray-500 mr-2.5" size={14} />
        <span className="font-medium font-mono">{stakable}</span>
        <span className="text-gray-400 relative -top-0.5">&nbsp; stakable</span>
      </div>
    </div>
  );
};
