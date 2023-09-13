import { FC, RefObject, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { useApproveAst } from "./hooks/useApproveAst";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import { ApproveSuccess } from "./subcomponents/ApproveSuccess";
import { ManageStake } from "./subcomponents/ManageStake";
import { StakeOrUnstake } from "./types/StakingTypes";
import {
  buttonStatusText,
  handleButtonActions,
  modalHeadline,
} from "./utils/helpers";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
  chainId: number;
}

export const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
  chainId,
}) => {
  const [stakeOrUnstake, setStakeOrUnstake] = useState<StakeOrUnstake>(
    StakeOrUnstake.STAKE,
  );

  const formReturn = useForm();
  const { watch, setValue } = formReturn;
  const stakingAmount = watch("stakingAmount") || "0";

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();
  const {
    ustakableSAstBalanceFormatted: unstakableSAstBalance,
    astBalanceFormatted: astBalance,
  } = useTokenBalances();

  const needsApproval =
    stakeOrUnstake === StakeOrUnstake.STAKE &&
    stakingAmount > 0 &&
    +astAllowance < +stakingAmount;

  const canStake =
    !needsApproval && +stakingAmount <= +astBalance && +stakingAmount > 0;

  const canUnstake =
    stakeOrUnstake === StakeOrUnstake.UNSTAKE && stakingAmount > 0
      ? +stakingAmount <= +unstakableSAstBalance
      : false;

  const { approve, statusApprove } = useApproveAst({
    stakingAmount,
    enabled: needsApproval,
  });

  const { stake, resetStake, transactionReceiptStake, statusStake } =
    useStakeAst({
      stakingAmount,
      enabled: canStake,
    });

  const { unstake, resetUnstake, statusUnstake, transactionReceiptUnstake } =
    useUnstakeSast({
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

  const isButtonDisabled =
    (stakeOrUnstake === StakeOrUnstake.STAKE && stakingAmount > astBalance) ||
    (stakeOrUnstake === StakeOrUnstake.UNSTAKE &&
      stakingAmount > unstakableSAstBalance) ||
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

  const isRenderApproveSuccess =
    statusStake === "success" || statusUnstake === "success";

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close();
    setValue("stakingAmount", 0);
  };

  return (
    <dialog
      className={twJoin([
        "border border-gray-800 bg-gray-900 p-6 text-white rounded-lg ",
        "w-fit xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3 max-w-[360px]",
      ])}
      ref={stakingModalRef}
    >
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl pb-4">{headline}</h2>
        <div className="hover:cursor-pointer pb-4" onClick={handleCloseModal}>
          <MdClose className="text-gray-500" size={26} />
        </div>
      </div>

      {isRenderManageStake ? (
        <ManageStake
          formReturn={formReturn}
          stakeOrUnstake={stakeOrUnstake}
          setStakeOrUnstake={setStakeOrUnstake}
          statusApprove={statusApprove}
          statusStake={statusStake}
          statusUnstake={statusUnstake}
        />
      ) : null}

      {isRenderApproveSuccess ? (
        <ApproveSuccess
          stakeOrUnstake={stakeOrUnstake}
          statusUnstake={statusUnstake}
          amount={stakingAmount.toString()}
          chainId={chainId}
          transactionHashStake={transactionReceiptStake?.transactionHash}
          transactionHashUnstake={transactionReceiptUnstake?.transactionHash}
        />
      ) : null}

      {/* TODO: border radius not rendering correctly. */}
      <Button
        className={twJoin([
          "flex flex-row items-center mb-2 mt-6 w-full !rounded-sm bg-airswap-blue font-semibold uppercase justify-center",
          `${isButtonDisabled && "opacity-50"}`,
        ])}
        isDisabled={isButtonDisabled}
        loadingSpinnerArgs={{
          stakeOrUnstake,
          needsApproval,
          statusApprove,
          statusStake,
          statusUnstake,
        }}
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
      >
        <span>{buttonText}</span>
      </Button>
    </dialog>
  );
};
