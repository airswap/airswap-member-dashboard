import { BsCircleFill } from "react-icons/bs";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import "../../index.css";
import { formatNumber } from "../common/utils/formatNumber";
import { calculateTokenProportions } from "./utils/calculateTokenProportions";

export const PieBar = () => {
  const { unstakableSastBalanceRaw, sAstBalanceRaw, astBalanceRaw } =
    useTokenBalances();

  // use these formatted numbers only for human-readable values, not for any calculations
  const unstaked = formatNumber(astBalanceRaw, 4) || 0;
  const staked = formatNumber(sAstBalanceRaw, 4) || 0;
  const unstakable = formatNumber(unstakableSastBalanceRaw, 4) || 0;

  const {
    unstakablePercent,
    totalStakedPercent,
    stakedPercent,
    unstakedPercent,
  } = calculateTokenProportions({
    unstakable: unstakableSastBalanceRaw,
    staked: sAstBalanceRaw,
    unstaked: astBalanceRaw,
  });

  const zeroBalance = !unstakablePercent && !stakedPercent && !unstakedPercent;

  const stakableData = [
    {
      color: "text-blue-500",
      bg: null,
      var: unstakable,
      text: "unstakable",
    },
    {
      color: "transparent",
      bg: "checkered-blue",
      var: staked,
      text: "staked",
    },
    {
      color: "text-gray-500",
      bg: null,
      var: unstaked,
      text: "not staked",
    },
  ];

  const stakableRow = stakableData.map((stakable) => {
    return (
      <div className="flex leading-none text-[15px]" key={stakable.text}>
        <div className={`${stakable.bg || stakable.color} rounded-full mr-2.5`}>
          <BsCircleFill className={`text-${stakable.color} `} size={14} />
        </div>
        <span className="font-medium font-mono">{stakable.var}</span>
        <span className="relative text-gray-400">&nbsp; {stakable.text}</span>
      </div>
    );
  });

  return (
    <div className="flex w-full flex-col my-6 gap-4">
      <div className="flex flex-row align m-auto h-2 mb-2 w-full rounded-full">
        {/* wrapper div holds totalStakedPercent, then 2 child divs are a percentage of totalStakedPercent */}
        <div
          className="checkered-blue relative z-0 rounded-l-full"
          style={{ flexBasis: `${totalStakedPercent}%` }}
        >
          <div
            style={{ flexBasis: `${unstakablePercent}%` }}
            className={twJoin(
              "bg-airswap-blue",
              zeroBalance
                ? "min-w-full rounded-full"
                : "min-w-[3px] rounded-l-full",
              unstakablePercent &&
                !stakedPercent &&
                !unstakablePercent &&
                "rounded-full",
            )}
          />
          <div
            style={{ flexBasis: `${stakedPercent}%` }}
            className={twJoin("checkered-blue", stakedPercent && "min-w-[3px]")}
          />
        </div>
        {/* div below is only unstaked */}
        <div
          style={{ flexBasis: `${unstakedPercent}%` }}
          className={twJoin(
            "bg-gray-500",
            unstakedPercent && "min-w-[3px] rounded-r-full",
          )}
        />
      </div>
      {stakableRow}
    </div>
  );
};
