import { Dispatch, FC } from "react";
import { IoMdOpen } from "react-icons/io"
import { useNetwork } from "wagmi";
import { etherscanLink } from "../../../utils/constants";
import greenCheck from "../../../assets/check-green.svg"
import { StatusStaking } from "../types/StakingTypes";
import { VscChromeClose } from "react-icons/vsc";

interface ApproveSuccessProps {
  handleCloseModal: () => void;
  setStatusStaking: Dispatch<StatusStaking>;
  amountApproved: string;
  transactionHash: string;
}

const ApproveSuccess: FC<ApproveSuccessProps> = ({ handleCloseModal, setStatusStaking, amountApproved, transactionHash }) => {
  const { chain } = useNetwork()

  const handleCloseMessage = () => {
    setStatusStaking("readyToStake")
    console.log('clicky')
  }

  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-semibold">Approve successful</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      <div className="flex flex-col items-center p-6">
        <div>
          <img
            src={greenCheck} alt="green check"
            onClick={handleCloseMessage}
          />
        </div>
        <div className="my-4 text-font-darkSubtext">
          <span>You successfully approved</span>
          <span className="ml-1 text-white font-medium">{amountApproved} AST</span>
        </div>
        <div className="flex items-center">
          <span>View on Etherscan</span>
          <div className="ml-2">
            <a href={etherscanLink(chain?.id || 1, transactionHash)}>
              <IoMdOpen />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}


export default ApproveSuccess
