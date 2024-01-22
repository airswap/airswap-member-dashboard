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
import { convertUnixToDays } from "./utils/convertUnixToDays";

export const ManageStake = ({
  formReturn,
  unstakeSastV4Deprecated,
}: {
  formReturn: UseFormReturn<FieldValues>;
  unstakeSastV4Deprecated: (() => Promise<WriteContractResult>) | undefined;
}) => {
  const { txType, setTxType } = useStakingModalStore();
  const { setValue } = formReturn;

  const {
    unstakableSastBalanceRaw: unstakableBalance,
    astBalanceRaw: stakableBalance,
  } = useTokenBalances();

  const {
    sAstBalance,
    sAstBalanceV4Deprecated: sAstV4Balance,
    sAstMaturityV4Deprecated: sAstV4Maturity,
  } = useStakesForAccount();

  // if timeLeftToUnstake <=0
  const timeLeftToUnstake = convertUnixToDays(sAstV4Maturity);

  const hasV4BalanceCanUnstake = sAstV4Balance && !timeLeftToUnstake;
  const hasV4BalanceCannotUnstake = sAstV4Balance && timeLeftToUnstake;

  const availableSAstV4Balance = formatNumber(sAstV4Balance, 4) || 0;

  const handleSetMaxBalance = () => {
    if (txType === TxType.STAKE) {
      setValue("stakingAmount", Number(stakableBalance / 10000n));
    } else {
      setValue("stakingAmount", Number(unstakableBalance / 10000n));
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

  // if use has v4.0 stake which has not fully vested
  const contentBoxV4Stake = () => {
    if (hasV4BalanceCanUnstake) {
      return (
        <div>
          You have {availableSAstV4Balance} AST staked in v4.{" "}
          {
            <span
              onClick={unstakeSastV4Deprecated}
              className="underline hover:cursor-pointer"
            >
              Unstake now
            </span>
          }
          .
        </div>
      );
    } else if (hasV4BalanceCannotUnstake) {
      return `You have ${availableSAstV4Balance} AST staked in v4. It can be unstaked in ${timeLeftToUnstake.days} days ${timeLeftToUnstake.hours} hours, ${timeLeftToUnstake.minutes} minutes`;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (sAstBalance != null && unstakableBalance != null) {
      if (sAstBalance === unstakableBalance) {
        setValue("stakingAmount", Number(sAstBalance / 10000n));
      }
    }
  }, [sAstBalance, unstakableBalance, setValue]);

  return (
    <div>
      <PieBar />
      <LineBreak className="relative mb-4 -mx-6" />
      <div className="mt-4 rounded px-4 py-3 text-xs leading-[18px] bg-gray-800 text-gray-400">
        <div className="flex flex-row gap-2 items-start">{contentBox}</div>
      </div>

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
        <div className="flex flex-row items-end uppercase w-full overflow-hidden">
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
