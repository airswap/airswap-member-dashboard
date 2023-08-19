import { FC } from "react";
import { calculateTokenProportions } from "../utils/calculateTokenProportions";
import { twJoin } from "tailwind-merge";
import { BsCircleFill } from "react-icons/bs";
import "../../../index.css";
import { useTokenBalances } from "../../../hooks/useTokenBalances";

interface StakableBarProps {
  mode: "stake" | "unstake";
}

/**
 *
 * @param unstakable - balance of sAST available to unstake
 * @param staked - total amount of SAST
 * @param stakable - amount of available AST
 * @returns
 */
export const StakableBar: FC<StakableBarProps> = ({ mode }) => {
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
    <div className="flex w-full flex-col space-y-3">
      {mode === "stake" && (
        <>
          <div className="m-auto mt-6 flex h-3 w-full flex-row rounded-full">
            <div
              style={{ flexBasis: `${unstakablePercent}%` }}
              className="checkered-blue rounded-l-full"
            ></div>
            <div
              style={{ flexBasis: `${stakedPercent}%` }}
              className="bg-accent-blue"
            ></div>
            <div
              style={{ flexBasis: `${stakablePercent}%` }}
              className="rounded-r-full bg-accent-gray"
            ></div>
          </div>
          <div className="flex flex-row items-center">
            <div className="checkered-blue rounded-full">
              <BsCircleFill className="text-transparent" />
            </div>
            <span className="mx-2">{unstakable}</span>
            unstakable
          </div>
          <div className="flex flex-row items-center">
            <BsCircleFill className="text-blue-500" />
            <span className="mx-2">{staked}</span>staked
          </div>
          <div className="flex flex-row items-center">
            <BsCircleFill className="text-accent-gray" />
            <span className="mx-2">{stakable}</span>stakable
          </div>
        </>
      )}
      {mode === "unstake" && (
        <>
          <div className="m-auto mt-6 flex h-3 w-[100%] flex-row rounded-full">
            <div
              className={twJoin(["w-full rounded-full bg-accent-gray"])}
              // style={{ flexBasis: `${stakablePercent}%` }}
            ></div>
          </div>
          <div className="flex flex-row items-center">
            <BsCircleFill className="text-accent-gray" />
            <span className="mx-2">{stakable}</span>stakable
          </div>
        </>
      )}
    </div>
  );
};
