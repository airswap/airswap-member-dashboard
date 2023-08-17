import { FC, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import AirSwapLogo from "../../../assets/airswap-logo.svg";
import LineBreak from "../../common/LineBreak";
import { Button } from "../../common/Button";
import { twJoin } from "tailwind-merge";
import NumberInput from "./NumberInput";

interface ManageStakeProps {
  sAstBalance: string;
  astBalance: string;
  formMethods: UseFormReturn<FieldValues>;
}

export type stakeOptions = "stake" | "unstake";

const ManageStake: FC<ManageStakeProps> = ({
  sAstBalance,
  astBalance,
  formMethods,
}) => {
  const [stakeOrUnstake, setStakeOrUnstake] = useState<stakeOptions>("stake");

  return (
    <>
      <LineBreak />
      <div className="flex flex-col space-y-3">
        {stakeOrUnstake === "stake" && (
          <>
            <div className="mt-6">
              {/* TODO: add progress bar here with AST balance */}
              (PROGRESS BAR)
            </div>
            <div className="flex flex-row">
              <span className="mr-2">{sAstBalance}</span>unstakable
            </div>
            <div className="flex flex-row">
              <span className="mr-2">{sAstBalance}</span>staked
            </div>
            <div className="flex flex-row">
              <span className="mr-2">{astBalance}</span>stakable
            </div>
          </>
        )}
        {stakeOrUnstake === "unstake" && (
          <>
            <div className="mt-6">
              {/* TODO: add progress bar here with AST balance */}
              (PROGRESS BAR)
            </div>
            <div className="flex flex-row">
              <span className="mr-2">{astBalance}</span>
              <span>stakable</span>
            </div>
          </>
        )}
      </div>
      <LineBreak />
      <div className="font-lg pointer-cursor mt-6 rounded-md font-semibold">
        <Button
          className={twJoin(
            "rounded-none rounded-l-md",
            "w-1/2 text-sm uppercase",
            `${stakeOrUnstake === "stake" && "bg-bg-darkShaded"}`,
          )}
          onClick={() => setStakeOrUnstake("stake")}
        >
          Stake
        </Button>
        <Button
          className={twJoin(
            "rounded-none rounded-r-md",
            "w-1/2 text-sm uppercase",
            `${stakeOrUnstake === "unstake" && "bg-bg-darkShaded"}`,
          )}
          onClick={() => setStakeOrUnstake("unstake")}
        >
          Unstake
        </Button>
      </div>
      <div
        className={twJoin(
          "my-3 rounded px-4 py-3 text-sm",
          "dark:bg-bg-darkShaded",
        )}
      >
        Stake AST prior to voting on proposals. The amount of tokens you stake
        determines the weight of your vote. Tokens unlock linearly over 20
        weeks.
      </div>
      <div className="flex items-center justify-between rounded border border-border-darkShaded bg-black px-4 py-2">
        <img src={AirSwapLogo} alt="AirSwap Logo" className="h-8 w-8 " />
        <div className="flex flex-col text-right  uppercase">
          <div>
            <NumberInput astBalance={astBalance} formMethods={formMethods} />
          </div>
          <span className="text-xs">{astBalance} stakable</span>
        </div>
      </div>
    </>
  );
};

export default ManageStake;
