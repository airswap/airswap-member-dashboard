import { FC } from "react"
import { VscChromeClose } from "react-icons/vsc"
import { twJoin } from "tailwind-merge";
import loadingSpinner from "../../../assets/loading-spinner.svg"

interface ApprovingProps {
  handleCloseModal: () => void;
}

const Approving: FC<ApprovingProps> = ({ handleCloseModal }) => {
  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-semibold">Approve token</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-auto animate-spin">
          <img src={loadingSpinner} alt="loading spinner" />
        </div>
        <div className="m-auto my-6">Token approval pending</div>
        <div className={twJoin(
          "text-sm py-3 px-4 rounded",
          "dark:bg-bg-darkShaded")}>
          To stake your AST you will have to approve the token spent. Please the transaction in your wallet, your wallet should open. If your wallet doesn’t open please try again.
        </div>
      </div>
    </>
  )
}

export default Approving
