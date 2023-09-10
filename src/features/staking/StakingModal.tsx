import { FC, RefObject, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { ManageStake } from "./ManageStake";
import { TransactionTracker } from "./TransactionTracker";
import { useAllowance } from "./hooks/useAllowance";
import { useApprove } from "./hooks/useApprove";
import { useStake } from "./hooks/useStake";
import { useUnstake } from "./hooks/useUnstake";
import { StakeOrUnstake, TransactionState } from "./types/StakingTypes";
import { buttonStatusText } from "./utils/buttonStatusText";
import { handleButtonActions } from "./utils/handleButtonActions";
import { transactionTrackerMessages } from "./utils/transactionTrackerMessages";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
}

export const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
}) => {
  const [stakeOrUnstake, setStakeOrUnstake] = useState<StakeOrUnstake>(
    StakeOrUnstake.STAKE,
  );
  const [trackerStatus, setTrackerStatus] = useState<TransactionState>(
    TransactionState.Idle,
  );

  const formReturn = useForm();
  const { watch, setValue } = formReturn;
  const stakingAmount = watch("stakingAmount") || "0";

  const { astAllowanceFormatted: astAllowance } = useAllowance();
  const { ustakableSAstBalanceFormatted: unstakableSAst } = useTokenBalances();

  const needsApproval = stakingAmount > +astAllowance;
  const canUnstake = stakingAmount <= +unstakableSAst;

  const { approve, statusApprove, isErrorApprove, transactionReceiptApprove } =
    useApprove({
      stakingAmount,
      enabled: needsApproval,
    });

  const {
    stake,
    resetStake,
    transactionReceiptStake,
    statusStake,
    isErrorStake,
  } = useStake({
    stakingAmount,
    enabled: !needsApproval,
  });

  const {
    unstake,
    resetUnstake,
    statusUnstake,
    transactionReceiptUnstake,
    isErrorUnstake,
  } = useUnstake({
    unstakingAmount: stakingAmount,
    canUnstake,
  });

  const buttonText = buttonStatusText({
    stakeOrUnstake,
    needsApproval,
    statusApprove,
    statusStake,
    statusUnstake,
  });

  const loadingTransactions =
    statusApprove === "loading" ||
    statusStake === "loading" ||
    statusUnstake === "loading";

  // button disabled if input is empty, or any transaction is pending
  const isButtonDisabled = stakingAmount <= 0 || loadingTransactions;

  const isLoadingSpinner = loadingTransactions;

  const headline = transactionTrackerMessages[trackerStatus].headline;

  // const renderManageStake = () => {
  //   if (statusStake === "success") {
  //     return false;
  //   } else if (statusUnstake === "success") {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  // const isRenderManageStake = renderManageStake();

  const relevantStatuses = ["loading", "error", "success"];
  const onlyShowTransactionTracker =
    relevantStatuses.includes(statusApprove) ||
    relevantStatuses.includes(statusStake) ||
    relevantStatuses.includes(statusUnstake);

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close();
    setValue("stakingAmount", 0);
  };

  return (
    <dialog
      className={twJoin([
        "content-center border border-border-darkGray bg-black p-6 text-white",
        "w-fit xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3",
      ])}
      ref={stakingModalRef}
    >
      <div className="flex justify-between">
        <h2 className="font-semibold">{headline}</h2>

        <div className="hover:cursor-pointer  " onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      {
        // isRenderManageStake ||
        <ManageStake
          displayManageStake={!onlyShowTransactionTracker}
          formReturn={formReturn}
          stakeOrUnstake={stakeOrUnstake}
          setStakeOrUnstake={setStakeOrUnstake}
          loadingStatus={[statusApprove, statusStake, statusUnstake]}
        />
      }

      <TransactionTracker
        stakeOrUnstake={stakeOrUnstake}
        trackerStatus={trackerStatus}
        setTrackerStatus={setTrackerStatus}
        stakingAmount={stakingAmount}
        statusApprove={statusApprove}
        statusStake={statusStake}
        statusUnstake={statusUnstake}
        isErrorApprove={isErrorApprove}
        isErrorStake={isErrorStake}
        isErrorUnstake={isErrorUnstake}
        transactionHashApprove={transactionReceiptApprove}
        transactionHashStake={transactionReceiptStake}
        transactionHashUnstake={transactionReceiptUnstake}
      />

      <Button
        className={twJoin([
          "flex flex-row items-center mb-2 mt-10 w-full rounded-sm bg-accent-blue font-semibold uppercase justify-center",
          `${isButtonDisabled && "opacity-50"}`,
        ])}
        onClick={() => {
          handleButtonActions({
            needsApproval,
            statusStake,
            statusUnstake,
            resetStake,
            resetUnstake,
            canUnstake,
            approve,
            stake,
            unstake,
            setValue,
          });
        }}
        disabled={isButtonDisabled}
      >
        {isLoadingSpinner && <ImSpinner8 className="animate-spin mr-2 " />}
        <span>{buttonText}</span>
      </Button>
    </dialog>
  );
};
