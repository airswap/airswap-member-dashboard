import { FC, RefObject, useState } from "react";
import AirSwapLogo from "../../assets/airswap-logo.svg";
import { VscChromeClose } from "react-icons/vsc";
import LineBreak from "../common/LineBreak";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";
import { useToggle } from "@react-hookz/web";
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { contractAddresses } from "../../utils/constants";
import stakingABI from '../../contracts/stakingAbi.json'
import astABI from '../../contracts/astAbi.json'
import StakeBalances from "./subcomponents/StakeBalances";
import UnstakeBalances from "./subcomponents/UnstakeBalances";
import { buttonStatusText } from "./uils/buttonStatusText";
import { encodeFunctionData } from "viem";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>,
  astBalance: string,
  sAstBalance: string,
  chainId: number
}

type StatusStaking = "unapproved" | "approved" | "staking" | "success"

const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
  astBalance,
  sAstBalance,
  chainId
}) => {
  const [isToggledStake, toggleStake] = useToggle(true);
  const [statusStaking, setStatusStaking] = useState<StatusStaking>("unapproved");
  const [stakingAmount, setStakingAmount] = useState<number>(0);

  // const approveData = encodeFunctionData({
  //   abi: astABI,
  //   functionName: 'approve',
  //   args: [contractAddresses[chainId].staking, stakingAmount * Math.pow(10, 4)]
  // })
  // console.log('approveData', approveData)

  const { config: configApprove } = usePrepareContractWrite({
    address: contractAddresses[chainId].AST as `0x${string}`,
    abi: astABI,
    functionName: 'approve',
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    args: [contractAddresses[chainId].staking, stakingAmount * Math.pow(10, 4)]
  })
  const { write: approveFunction } = useContractWrite(configApprove)
  // console.log('approveFunction', approveFunction)

  const {
    config: configStake,
  } = usePrepareContractWrite({
    address: contractAddresses[chainId].staking as `0x${string}`,
    abi: stakingABI,
    functionName: 'stake',
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  })
  const { write: stakeFunction } = useContractWrite(configStake)

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close()
  }

  const stakable = +astBalance - stakingAmount

  const buttonText = buttonStatusText(statusStaking)

  const buttonAction = () => {
    switch (statusStaking) {
      case 'unapproved':
        if (approveFunction)
          return approveFunction
        break;
      case 'staking':
        return;
      case 'success':
        return;
      case 'approved':
        return;
    }
  };
  console.log('buttonAction', buttonAction())

  return (
    <dialog className={twJoin("content-center bg-black p-4 text-white border border-border-darkGray",
      ['w-fit xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/5'])} ref={stakingModalRef}>
      <div className="flex justify-between">
        <h2 className="font-semibold">Manage Stake</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      <LineBreak />
      <div className="flex flex-col space-y-3">
        {isToggledStake &&
          <StakeBalances unstakable="5.7k" staked="180k" stakable="30.1k" />}
        {!isToggledStake &&
          <UnstakeBalances stakedBalance={sAstBalance} />}
      </div>
      <LineBreak />
      <div className="mt-6 font-lg rounded-md font-semibold pointer-cursor">
        <Button
          className={twJoin(
            "rounded-none rounded-l-md",
            "w-1/2 uppercase text-sm",
            `${isToggledStake && 'bg-bg-darkShaded'}`
          )}
          onClick={toggleStake}
        >Stake</Button>
        <Button
          className={twJoin(
            "rounded-none rounded-r-md",
            "w-1/2 uppercase text-sm",
            `${!isToggledStake && 'bg-bg-darkShaded'}`
          )}
          onClick={toggleStake}
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
              type="number"
              value={stakingAmount}
              onChange={(e) => setStakingAmount(+e.target.value)}
              className="text-right w-1/5 items-right"
            />
          </div>
          {/* <span className="text-lg font-medium">{sAstBalance}</span> */}
          <span className="text-xs">{stakable} stakable</span>
        </div>
      </div>
      <Button
        className="rounded-sm w-full uppercase font-semibold bg-accent-blue mt-10 mb-2"
        onClick={buttonAction()}
      >{buttonText}</Button>
    </dialog>
  )
}

export default StakingModal
