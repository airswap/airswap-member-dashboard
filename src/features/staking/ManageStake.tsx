import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { IoMdAlert } from "react-icons/io";
import { twJoin } from "tailwind-merge";
import { WriteContractResult } from "wagmi/actions";
import AirSwapLogo from "../../assets/airswap-logo.svg";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { LineBreak } from "../common/LineBreak";
import { formatNumber } from "../common/utils/formatNumber";
import { NumberInput } from "./NumberInput";
import { PieBar } from "./PieBar";
import { useStakesForAccount } from "./hooks/useStakesForAccount";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { TxType } from "./types/StakingTypes";
import { bigIntToUnits } from "./utils/bigIntToUnits";
import { convertUnixToDays } from "./utils/convertUnixToDays";

export const ManageStake = ({
  formReturn,
  unstakeSastV4Deprecated,
}: {
  formReturn: UseFormReturn<FieldValues>;
  unstakeSastV4Deprecated: (() => Promise<WriteContractResult>) | undefined;
}) => {
  const { txType, setTxType, setV4UnstakingBalance } = useStakingModalStore();
  const { setValue } = formReturn;

  const {
    unstakableSastBalanceRaw: unstakableBalance,
    astBalanceRaw: stakableBalance,
  } = useTokenBalances();

  const {
    sAstBalanceV4Deprecated: sAstV4Balance,
    sAstMaturityV4Deprecated: sAstV4Maturity,
  } = useStakesForAccount();

  const timeLeftToUnstake = convertUnixToDays(sAstV4Maturity);

  const hasV4BalanceCanUnstake = sAstV4Balance && !timeLeftToUnstake;
  const hasV4BalanceCannotUnstake = sAstV4Balance && timeLeftToUnstake;

  const availableSAstV4Balance = formatNumber(sAstV4Balance, 4) || 0;

  const handleSetMaxBalance = () => {
    if (txType === TxType.STAKE) {
      setValue("stakingAmount", bigIntToUnits(stakableBalance));
    } else {
      setValue("stakingAmount", bigIntToUnits(unstakableBalance));
    }
  };

  const handleSwitchStakeButton = () => {
    if (txType === TxType.UNSTAKE) {
      setTxType(TxType.STAKE);
      setValue("stakingAmount", undefined);
    } else {
      null;
    }
  };

  const handleSwitchUntakeButton = () => {
    if (txType === TxType.STAKE) {
      setTxType(TxType.UNSTAKE);
      setValue("stakingAmount", undefined);
    } else {
      null;
    }
  };

  const handleUnstakeFromContentBox = () => {
    setValue("stakingAmount", undefined);
    unstakeSastV4Deprecated && unstakeSastV4Deprecated();
  };

  const contentBox = (
    <div>
      New stakes are locked for 20 weeks and unlocked linearly.{" "}
      {
        <a
          href="https://about.airswap.io/about/frequently-asked-questions#what-are-the-rules-of-staking"
          target="_blank"
          rel="noopener noreferer"
          className="underline"
        >
          Learn more about staking
        </a>
      }
      .
    </div>
  );
  const showContentBox = txType === TxType.STAKE || !sAstV4Balance;

  // if use has v4.0 stake which has not fully vested
  const contentBoxV4Stake = () => {
    if (hasV4BalanceCanUnstake) {
      return (
        <div>
          You have{" "}
          <span className="rounded-sm text-white">
            {availableSAstV4Balance}
          </span>{" "}
          AST staked in the deprecated v4 contract which you can{" "}
          {
            <button
              type="button"
              onClick={handleUnstakeFromContentBox}
              className="underline hover:cursor-pointer"
            >
              unstake in full now
            </button>
          }
          .
        </div>
      );
    } else if (hasV4BalanceCannotUnstake) {
      return (
        <div>
          You have{" "}
          <span className="rounded-sm text-white">
            {availableSAstV4Balance}
          </span>{" "}
          AST staked in V4, which you can continue to use it to vote. If you
          would like to unstake these tokens, the full balance will be available
          in{" "}
          <span className="rounded-sm text-white">
            {timeLeftToUnstake.days} days {timeLeftToUnstake.hours} hours,{" "}
            {timeLeftToUnstake.minutes} minutes
          </span>
          .{" "}
          {
            <a
              href="https://about.airswap.io/announcements#id-4.1-migration-30-january-2024"
              target="_blank"
              rel="noopener noreferer"
              className="underline"
            >
              Read our official announcement for more details
            </a>
          }
          .
        </div>
      );
    } else {
      return null;
    }
  };

  // v4UnstakingBalance gets set here, so it can be passed into StakingModal (after Verb) after a successful v4 unstake
  useEffect(() => {
    if (hasV4BalanceCanUnstake) {
      setV4UnstakingBalance(Number(sAstV4Balance));
    }
  }, [hasV4BalanceCanUnstake, setV4UnstakingBalance, sAstV4Balance]);

  return (
    <div>
      <PieBar />
      <LineBreak className="relative mb-4 -mx-6" />
      {showContentBox && (
        <div className="mt-4 rounded px-4 py-3 text-xs leading-[18px] bg-gray-800 text-gray-400">
          <div className="flex flex-row gap-2 items-start">{contentBox}</div>
        </div>
      )}

      {txType === TxType.UNSTAKE && !!sAstV4Balance && (
        <div className="mt-4 rounded px-4 py-3 text-xs leading-[18px] bg-gray-800 text-gray-400">
          <div className="flex flex-row gap-2 items-center">
            <div>
              <IoMdAlert size={20} />
            </div>
            {availableSAstV4Balance && <div>{contentBoxV4Stake()}</div>}
          </div>
        </div>
      )}
      <div className="my-4 font-lg pointer-cursor rounded-md font-semibold">
        <Button
          className={twJoin([
            "w-1/2 p-2",
            `${txType === "stake" ? "bg-gray-800" : "text-gray-500"}`,
          ])}
          rounded="leftFalse"
          size="small"
          onClick={handleSwitchStakeButton}
        >
          Stake
        </Button>
        <Button
          className={twJoin(
            "w-1/2 p-2",
            `${txType === "unstake" ? "bg-gray-800" : "text-gray-500"}`,
          )}
          rounded="rightFalse"
          size="small"
          color="transparent"
          onClick={handleSwitchUntakeButton}
        >
          Unstake
        </Button>
      </div>
      <div className="flex items-center justify-between rounded border border-gray-800 bg-gray-950 px-5 py-4">
        <img src={AirSwapLogo} alt="AirSwap Logo" className="h-8 w-8" />
        <div className="flex flex-row uppercase w-full overflow-hidden">
          <div>
            <NumberInput formReturn={formReturn} />
          </div>
          <Button
            onClick={handleSetMaxBalance}
            color="darkGray"
            size="smaller"
            rounded="small"
            className="flex self-center ml-4 enabled:hover:bg-white"
          >
            max
          </Button>
        </div>
      </div>
    </div>
  );
};
