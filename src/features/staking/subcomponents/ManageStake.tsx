import { Dispatch, FC } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twJoin } from "tailwind-merge";
import AirSwapLogo from "../../../assets/airswap-logo.svg";
import { useTokenBalances } from "../../../hooks/useTokenBalances";
import { Button } from "../../common/Button";
import { LineBreak } from "../../common/LineBreak";
import { StakeOrUnstake, Status } from "../types/StakingTypes";
import { NumberInput } from "./NumberInput";
import { StakableBar } from "./StakableBar";

interface ManageStakeProps {
  formReturn: UseFormReturn<FieldValues>;
  stakeOrUnstake: StakeOrUnstake;
  setStakeOrUnstake: Dispatch<StakeOrUnstake>;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
}

export const ManageStake: FC<ManageStakeProps> = ({
  formReturn,
  stakeOrUnstake,
  setStakeOrUnstake,
  statusApprove,
  statusStake,
  statusUnstake,
}) => {
  const {
    astBalanceFormatted: astBalance,
    ustakableSAstBalanceFormatted: unstakableSAstBalance,
  } = useTokenBalances();

  const isTransactionLoading =
    statusApprove === "loading" ||
    statusStake === "loading" ||
    statusUnstake === "loading";

  return (
    <>
      <LineBreak />
      <StakableBar />
      <LineBreak />
      <div className="font-lg pointer-cursor mt-6 rounded-md font-semibold">
        <Button
          className={twJoin([
            "rounded-none rounded-l-md",
            "w-1/2 text-sm uppercase",
            `${stakeOrUnstake === "stake" && "bg-bg-darkShaded"}`,
            `${isTransactionLoading && "opacity-50"}`,
          ])}
          onClick={() => setStakeOrUnstake(StakeOrUnstake.STAKE)}
          disabled={isTransactionLoading}
        >
          Stake
        </Button>
        <Button
          className={twJoin(
            "rounded-none rounded-r-md",
            "w-1/2 text-sm uppercase",
            `${stakeOrUnstake === "unstake" && "bg-bg-darkShaded"}`,
          )}
          onClick={() => setStakeOrUnstake(StakeOrUnstake.UNSTAKE)}
          disabled={isTransactionLoading}
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
        <div className="flex flex-col text-right uppercase w-full">
          <div>
            <NumberInput
              stakeOrUnstake={stakeOrUnstake}
              astBalance={astBalance.toString()}
              unstakableSAstBalance={unstakableSAstBalance.toString()}
              formReturn={formReturn}
              name="stakingAmount"
              isDisabled={!!isTransactionLoading}
            />
          </div>
          <span className="text-xs">
            {stakeOrUnstake === StakeOrUnstake.STAKE
              ? astBalance
              : unstakableSAstBalance}{" "}
            {stakeOrUnstake === StakeOrUnstake.STAKE
              ? "stakable"
              : "unstakable"}
          </span>
        </div>
      </div>
    </>
  );
};
