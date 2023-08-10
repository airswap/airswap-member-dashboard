import { FC, useState } from "react";
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import AirSwapLogo from "../../../assets/airswap-logo.svg";
import LineBreak from "../../common/LineBreak";
import StakeBalances from "./StakeBalances";
import UnstakeBalances from "./UnstakeBalances";
import { Button } from "../../common/Button";
import { twJoin } from "tailwind-merge";
import { StakeInput } from "../types/StakingTypes";

interface ManageStakeProps {
  sAstBalance: string;
  astBalance: string;
  register: UseFormRegister<StakeInput>
  setValue: UseFormSetValue<StakeInput>
}

const ManageStake: FC<ManageStakeProps> = ({
  sAstBalance,
  astBalance,
  register,
  setValue
}) => {
  const [stakeOrUnstake, setStakeOrUnstake] = useState<"stake" | "unstake">("stake")

  return (
    <>
      <LineBreak />
      <div className="flex flex-col space-y-3">
        {stakeOrUnstake === "stake" &&
          <StakeBalances unstakable={sAstBalance} staked={sAstBalance} stakable={astBalance} />}
        {stakeOrUnstake === "unstake" &&
          <UnstakeBalances stakedBalance={astBalance} />}
      </div>
      <LineBreak />
      <div className="mt-6 font-lg rounded-md font-semibold pointer-cursor">
        <Button
          className={twJoin(
            "rounded-none rounded-l-md",
            "w-1/2 uppercase text-sm",
            `${stakeOrUnstake === "stake" && 'bg-bg-darkShaded'}`
          )}
          onClick={() => setStakeOrUnstake("stake")}
        >Stake</Button>
        <Button
          className={twJoin(
            "rounded-none rounded-r-md",
            "w-1/2 uppercase text-sm",
            `${stakeOrUnstake === "unstake" && 'bg-bg-darkShaded'}`
          )}
          onClick={() => setStakeOrUnstake("unstake")}
        >Unstake</Button>
      </div>
      <div className={twJoin(
        "text-sm py-3 px-4 my-3 rounded",
        "dark:bg-bg-darkShaded")}>
        Stake AST prior to voting on proposals. The amount of tokens you stake determines the weight of your vote. Tokens unlock linearly over 20 weeks.
      </div>
      <div className="flex bg-black border border-border-darkShaded rounded px-4 py-2 justify-between items-center">
        <img src={AirSwapLogo} alt="AirSwap Logo" className='w-8 h-8 ' />
        <div className="flex flex-col text-right  uppercase">
          <div>
            <input
              placeholder={astBalance}
              {...register("stakingAmount", {
                required: true,
                min: 0,
                max: astBalance,
                validate: (val: number) => val > 0,
                onChange: (e) => setValue('stakingAmount', e.target.value)
              })}
              className={twJoin(
                "text-right w-1/5 items-right bg-black text-white",
              )}

            />
          </div>
          <span className="text-xs">{astBalance} stakable</span>
        </div>
      </div>
    </>
  )
}

export default ManageStake
