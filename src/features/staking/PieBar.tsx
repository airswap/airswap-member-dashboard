import { BsCircleFill } from "react-icons/bs";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import "../../index.css";
import { formatNumber } from "../common/utils/formatNumber";
import { calculateTokenProportions } from "./utils/calculateTokenProportions";

export const PieBar = () => {
  const { unstakableSastBalanceRaw, sAstBalanceRaw, astBalanceRaw } =
    useTokenBalances();

  const unstaked = formatNumber(astBalanceRaw, 4) || 0;
  const staked = formatNumber(sAstBalanceRaw, 4) || 0;
  const unstakable = formatNumber(unstakableSastBalanceRaw, 4) || 0;

  const {
    totalStakedPercent,
    unstakablePercent,
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
      <div
        className="flex flex-row items-center leading-none text-[15px]"
        key={stakable.text}
      >
        <div className={`${stakable.bg || stakable.color} rounded-full mr-2.5`}>
          <BsCircleFill className={`text-${stakable.color} `} size={14} />
        </div>
        <span className="font-medium font-mono">{stakable.var}</span>
        <span className="content-end text-gray-400 relative -top-0.5">
          &nbsp; {stakable.text}
        </span>
      </div>
    );
  });

  return (
    <div className="flex w-full flex-col my-6 gap-4">
      <div className="m-auto flex h-2 mb-2 w-full flex-row rounded-full">
        {/* this div should wrap unstakablePercent and staked percent, and represents totalStakedPercent */}
        <div
          style={{ flexBasis: `${totalStakedPercent}%` }}
          className={twJoin(
            "flex flex-row w-full",
            unstakablePercent ? "rounded-l-full" : "rounded-full",
          )}
        >
          <div
            style={{ flexBasis: `${unstakablePercent}%` }}
            className={twJoin(
              "bg-airswap-blue z-50",
              zeroBalance
                ? `min-w-${unstakablePercent} rounded-full`
                : "min-w-[3px] rounded-l-full",
              unstakablePercent &&
                !stakedPercent &&
                !unstakablePercent &&
                "rounded-full",
            )}
          />
          <div
            style={{ flexBasis: `${stakedPercent}%` }}
            className={twJoin(
              "checkered-blue z-50",
              stakedPercent && "min-w-[3px]",
            )}
          />
        </div>
        <div
          style={{ flexBasis: `${unstakedPercent}%` }}
          className={twJoin(
            "bg-gray-500",
            unstakedPercent && "min-w-[3px] rounded-r-full",
            zeroBalance && "min-w-full rounded-full",
          )}
        />
      </div>
      {stakableRow}
    </div>
  );
};
