import { BsCircleFill } from "react-icons/bs";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import "../../index.css";
import { calculateTokenProportions } from "./utils/calculateTokenProportions";

export const PieBar = () => {
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

  const stakableData = [
    {
      color: "text-gray-500",
      bg: null,
      var: stakable,
      text: "stakable",
    },
    {
      color: "text-blue-500",
      bg: null,
      var: staked,
      text: "staked",
    },
    {
      color: "transparent",
      bg: "checkered-blue",
      var: unstakable,
      text: "unstakable",
    },
  ];

  const stakableRow = stakableData.map((stakable) => {
    return (
      <div
        className="flex flex-row items-center leading-none text-[15px]"
        key={stakable.text}
      >
        <div className={`${stakable.bg || stakable.color} rounded-full mr-2.5`}>
          <BsCircleFill className={`text-${stakable.color} `} size={14} />
        </div>
        <span className="font-medium font-mono">{stakable.var}</span>
        <span className="text-gray-400 relative -top-0.5">
          &nbsp; {stakable.text}
        </span>
      </div>
    );
  });

  return (
    <div className="flex w-full flex-col my-6 gap-4">
      <div className="m-auto flex h-2 mb-2 w-full flex-row rounded-full">
        <div
          style={{ flexBasis: `${stakablePercent}%` }}
          className={twJoin(
            "bg-gray-500",
            zeroBalance
              ? "min-w-full rounded-full"
              : "min-w-[3px] rounded-l-full",
          )}
        />
        <div
          style={{ flexBasis: `${stakedPercent}%` }}
          className={twJoin(
            "bg-airswap-blue",
            stakablePercent && "min-w-[3px]",
          )}
        />
        <div
          style={{ flexBasis: `${unstakablePercent}%` }}
          className={twJoin(
            "checkered-blue",
            unstakablePercent && "min-w-[3px] rounded-r-full",
          )}
        />
      </div>
      {stakableRow}
    </div>
  );
};
