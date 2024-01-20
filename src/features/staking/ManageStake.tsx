import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { IoMdAlert } from "react-icons/io";
import { twJoin } from "tailwind-merge";
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

export const ManageStake = ({
  formReturn,
  canUnstakeV4Balance,
}: {
  formReturn: UseFormReturn<FieldValues>;
  canUnstakeV4Balance: boolean;
}) => {
  const { txType, setTxType } = useStakingModalStore();
  const { setValue } = formReturn;

  const {
    unstakableSastBalanceRaw: unstakableBalance,
    astBalanceRaw: stakableBalance,
  } = useTokenBalances();

  // TODO: for v4.1, if currentTimestamp > maturity and balance > 0, show unstaking modal only for v4.2. If sAstBalanceV4Deprecated = 0, show regular UI only applicable for v4.2
  const {
    sAstBalance,
    sAstBalanceV4Deprecated: sAstV4Balance,
    sAstMaturityV4Deprecated: sAstV4Maturity,
  } = useStakesForAccount();

  console.log(sAstV4Maturity);

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

  const isMaxButtonDisabled =
    canUnstakeV4Balance && txType === TxType.UNSTAKE ? true : false;

  // if use has v4.0 stake which has not fully vested
  const handleDisplayMessage = () => {
    if (+availableSAstV4Balance > 0 && txType === TxType.UNSTAKE) {
      `Hey! You've got a V4.1 stake. You currently have ${availableSAstV4Balance} AST avaialble to unstake. The remainder of your tokens are still vesting. We're halting withdrawals of unvested AST from the v4.1 contract. However, you may unstake your available AST from the v4.2 contract.`;
    } else {
      return "Stake AST prior to voting on proposals. The amount of tokens you stake determines the weight of your vote. Tokens unlock linearly over 20 weeks.";
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
      <div className="font-lg pointer-cursor rounded-md font-semibold">
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
      <div
        className={twJoin(
          "my-4 rounded px-4 py-3 text-xs leading-[18px]",
          "bg-gray-800 text-gray-400",
        )}
      >
        <div className="flex flex-row gap-2 items-start">
          {!!sAstV4Balance && sAstV4Balance > 0 && (
            <div>
              <IoMdAlert size={20} className="mt-1" />
            </div>
          )}
          <div>{handleDisplayMessage()}</div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded border border-gray-800 bg-gray-950 px-5 py-4">
        <img src={AirSwapLogo} alt="AirSwap Logo" className="h-8 w-8" />
        <div className="flex flex-row items-end uppercase w-full overflow-hidden">
          <div>
            <NumberInput
              formReturn={formReturn}
              canUnstakeV4Balance={canUnstakeV4Balance}
            />
          </div>
          <Button
            disabled={isMaxButtonDisabled}
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
