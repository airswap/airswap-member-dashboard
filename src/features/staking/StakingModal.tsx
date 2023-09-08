import { FC, RefObject, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { ManageStake } from "./ManageStake";
import { TransactionTracker } from "./TransactionTracker";
import { useApproveAst } from "./hooks/useApproveAst";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import { StakeOrUnstake } from "./types/StakingTypes";
import {
  buttonLoadingSpinner,
  buttonStatusText,
  handleButtonActions,
  modalHeadline,
} from "./utils/helpers";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
}

export const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
}) => {
  const [stakeOrUnstake, setStakeOrUnstake] = useState<StakeOrUnstake>(
    StakeOrUnstake.STAKE,
  );

  const formReturn = useForm();
  const { watch, setValue } = formReturn;
  const stakingAmount = watch("stakingAmount") || "0";

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();
  const { ustakableSAstBalanceFormatted } = useTokenBalances();

  const needsApproval =
    stakeOrUnstake === StakeOrUnstake.STAKE && stakingAmount > 0
      ? Number(astAllowance) < stakingAmount
      : false;

  const canUnstake =
    stakeOrUnstake === StakeOrUnstake.UNSTAKE && stakingAmount > 0
      ? stakingAmount <= Number(ustakableSAstBalanceFormatted)
      : false;

  const { approve, statusApprove, isErrorApprove } = useApproveAst({
    stakingAmount,
    enabled: needsApproval,
  });

  const {
    stake,
    resetStake,
    transactionReceiptStake,
    statusStake,
    isErrorStake,
  } = useStakeAst({
    stakingAmount,
    enabled: !needsApproval,
  });

  const {
    unstake,
    resetUnstake,
    statusUnstake,
    transactionReceiptUnstake,
    isErrorUnstake,
  } = useUnstakeSast({
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

  const isLoadingSpinner = buttonLoadingSpinner({
    stakeOrUnstake,
    needsApproval,
    statusApprove,
    statusStake,
    statusUnstake,
  });

  const isButtonDisabled =
    stakingAmount <= 0 ||
    buttonText === "Approving..." ||
    buttonText === "Staking..." ||
    buttonText === "Unstaking...";

  const headline = modalHeadline({ statusStake, statusUnstake });

  const renderManageStake = () => {
    if (statusStake === "success") {
      return false;
    } else if (statusUnstake === "success") {
      return false;
    } else {
      return true;
    }
  };
  const isRenderManageStake = renderManageStake();

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
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      {isRenderManageStake ? (
        <ManageStake
          formReturn={formReturn}
          stakeOrUnstake={stakeOrUnstake}
          setStakeOrUnstake={setStakeOrUnstake}
          loadingStatus={[statusApprove, statusStake, statusUnstake]}
        />
      ) : null}

      <TransactionTracker
        stakeOrUnstake={stakeOrUnstake}
        stakingAmount={stakingAmount}
        statusApprove={statusApprove}
        statusStake={statusStake}
        statusUnstake={statusUnstake}
        isErrorArrays={[isErrorApprove, isErrorStake, isErrorUnstake]}
        transactionHashArray={[
          transactionReceiptStake,
          transactionReceiptUnstake,
        ]}
      />

      <Button
        className={twJoin([
          "flex flex-row items-center mb-2 mt-10 w-full rounded-sm bg-accent-blue font-semibold uppercase justify-center",
          `${isButtonDisabled && "opacity-50"}`,
        ])}
        onClick={() => {
          handleButtonActions({
            stakeOrUnstake,
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
