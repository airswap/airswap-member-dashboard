import { FC, RefObject } from "react";
import { VscChromeClose } from "react-icons/vsc";
import LineBreak from "../common/LineBreak";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>
}

const StakingModal: FC<StakingModalInterface> = ({ stakingModalRef }) => {
  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close()
  }
  return (
    <dialog className="content-center h-1/2 w-1/2 bg-black p-4 text-white border-white border" ref={stakingModalRef}>
      <div className="flex justify-between">
        <h2 className="font-semibold">Manage Stake</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      <LineBreak />
    </dialog>
  )
}

export default StakingModal
