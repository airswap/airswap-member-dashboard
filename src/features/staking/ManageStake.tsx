import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { IoMdAlert } from "react-icons/io";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import AirSwapLogo from "../../assets/airswap-logo.svg";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { LineBreak } from "../common/LineBreak";
import { formatNumber } from "../common/utils/formatNumber";
import { NumberInput } from "./NumberInput";
import { PieBar } from "./PieBar";
import { useStakingModalStore } from "./store/useStakingModalStore";
import { TxType } from "./types/StakingTypes";

export const ManageStake = ({
  formReturn,
}: {
  formReturn: UseFormReturn<FieldValues>;
}) => {
  const { address: connectedAddress } = useAccount();
  const { txType, setTxType } = useStakingModalStore();
  const { setValue } = formReturn;

  const [sAstTokenV4_deprecated] = useContractAddresses(
    [ContractTypes.AirSwapV4Staking_deprecated],
    {
      defaultChainId: 1,
      useDefaultAsFallback: true,
    },
  );

  const {
    unstakableSastBalanceRaw: unstakableBalance,
    astBalanceRaw: stakableBalance,
    sAstBalanceRaw: sAstBalance,
    sAstBalanceV4_DeprecatedRaw: sAstBalanceV4,
  } = useTokenBalances();

  const { unstakableSastBalanceV4_DeprecatedRaw: availableBalanceV4 } =
    useTokenBalances();

  const availableBalance = formatNumber(availableBalanceV4, 4);

  useEffect(() => {
    if (sAstBalance != null && unstakableBalance != null) {
      if (sAstBalance === unstakableBalance) {
        setValue("stakingAmount", Number(sAstBalance / 10000n));
      }
    }
  }, [sAstBalance, unstakableBalance, setValue]);

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

  const displayMessage = () => {
    if (sAstBalanceV4 > 0 && txType === TxType.UNSTAKE) {
      `Hey! You've got a V4.1 stake. You currently have ${
        availableBalance || 50
      } AST avaialble to unstake. The remainder of your tokens are still vesting. We're halting withdrawals of unvested AST from the v4.1 contract. However, you may unstake your available AST from the v4.2 contract.`;
    } else {
      return "Stake AST prior to voting on proposals. The amount of tokens you stake determines the weight of your vote. Tokens unlock linearly over 20 weeks.";
    }
  };

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
          {sAstBalanceV4 > 0 && (
            <div>
              <IoMdAlert size={20} className="mt-1" />
            </div>
          )}
          <div>{displayMessage()}</div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded border border-gray-800 bg-gray-950 px-5 py-4">
        <img src={AirSwapLogo} alt="AirSwap Logo" className="h-8 w-8" />
        <div className="flex flex-row items-end uppercase w-full overflow-hidden">
          <div>
            <NumberInput formReturn={formReturn} />
          </div>
          <Button
            disabled
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
