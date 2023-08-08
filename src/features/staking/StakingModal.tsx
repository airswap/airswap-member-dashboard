import { FC, RefObject } from "react";
import AirSwapLogo from "../../assets/airswap-logo.svg";
import { VscChromeClose } from "react-icons/vsc";
import LineBreak from "../common/LineBreak";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";
import { useToggle } from "@react-hookz/web";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>
}

const StakingModal: FC<StakingModalInterface> = ({ stakingModalRef }) => {
  const [isToggledStake, toggleStake] = useToggle(true);
  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close()
  }
  return (
    <dialog className={twJoin("content-center bg-black p-4 text-white border border-border-darkGray",
      'w-fit xs:w-4/5 sm:w-3/5 md:w-1/3 lg:w-2/5 xl:w-1/5')} ref={stakingModalRef}>
      <div className="flex justify-between">
        <h2 className="font-semibold">Manage Stake</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      <LineBreak />


      <div className="flex flex-col space-y-3">
        {isToggledStake ?
          (
            <>
              <div className="mt-6">
                (PROGRESS BAR)
                {/* TODO: add progress bar here with AST balance */}
              </div>
              <div className="flex flex-row">
                <span className="mr-2">5.7k</span>unstakable
              </div>
              <div className="flex flex-row">
                <span className="mr-2">180k</span>staked
              </div>
              <div className="flex flex-row">
                <span className="mr-2">30.1k</span>stakable
              </div>
            </>
          ) : (
            <>
              <div className="mt-6">
                (PROGRESS BAR)
                {/* TODO: add progress bar here with AST balance */}
              </div>
              <div className="flex flex-row">
                <span className="mr-2">30.1k</span>
                <span>stakable</span>
              </div>
            </>
          )}
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
        <div className="flex flex-col text-right">
          <span className="text-lg font-medium">5700</span>
          <span className="text-xs">30,100.00 stakable</span>
        </div>
      </div>
      <Button className="rounded-sm w-full uppercase font-semibold bg-accent-blue mt-10 mb-2">approve token</Button>
    </dialog>
  )
}

export default StakingModal
