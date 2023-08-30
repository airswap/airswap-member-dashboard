import { BsCircleFill } from "react-icons/bs";
import { useTokenBalances } from "../../../hooks/useTokenBalances";
import "../../../index.css";
import { calculateTokenProportions } from "../utils/calculateTokenProportions";

/**

 * @param unstakable - balance of sAST available to unstake
 * @param staked - total amount of SAST
 * @param stakable - amount of available AST
 * @returns component that displays a visual representation of available token balances
 */
export const StakableBar = () => {
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
      <div className="m-auto mt-6 flex h-3 w-full flex-row rounded-full">
        <div
          style={{ flexBasis: `${unstakablePercent}%` }}
          className="checkered-blue rounded-l-full min-w-[3%]"
        ></div>
        <div
          style={{ flexBasis: `${stakedPercent}%` }}
          className="bg-accent-blue"
        ></div>
        <div
          style={{ flexBasis: `${stakablePercent}%` }}
          className="rounded-r-full bg-accent-gray min-w-[3%]"
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
    </div>
  );
};
