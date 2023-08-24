import { FC, RefObject, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import { Button } from "../common/Button";
import { useApproveToken } from "./hooks/useApproveToken";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import ApproveSuccess from "./subcomponents/ApproveSuccess";
import ManageStake from "./subcomponents/ManageStake";
import PendingTransaction from "./subcomponents/PendingTransaction";
import TransactionFailed from "./subcomponents/TransactionFailed";
import { StakingStatus } from "./types/StakingTypes";
import { handleStatusStaking } from "./utils/handleStatusStaking";
import { buttonStatusText, modalHeadline } from "./utils/helpers";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>;
  chainId: number;
}

const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
  chainId,
}) => {
  const [statusStaking, setStatusStaking] =
    useState<StakingStatus>("unapproved");

  const {
    register,
    watch,
    setValue,
    // formState: { errors },
  } = useForm<{ stakingAmount: number }>();
  const stakingAmount = watch("stakingAmount") || 0;

  const { astAllowanceFormatted: astAllowance, refetchAllowance } =
    useAstAllowance();

  const needsApproval =
    stakingAmount > 0 ? Number(astAllowance) < stakingAmount : true;
  console.log(stakingAmount, "stakingAmount", astAllowance, "astAllowance");

  const { approve, hashApprove, statusApprove } = useApproveToken({
    stakingAmount,
    needsApproval,
  });

  const { stake, hashStake, statusStake } = useStakeAst({
    stakingAmount,
    needsApproval,
  });

  const handleClickApprove = useCallback(async () => {
    if (approve) {
      const receipt = await approve();
      await receipt;
      refetchAllowance();
    }
  }, [approve, refetchAllowance]);

  const handleClickStake = useCallback(async () => {
    if (stake) {
      const receipt = await stake();
      await receipt;
      await console.log(receipt);
    }
  }, [stake]);

  const headline = modalHeadline(statusStaking);

  // button should not render on certain components
  const shouldRenderBtn = () => {
    if (
      statusStaking === "approving" ||
      statusStaking === "approved" ||
      statusStaking === "staking"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isShouldRenderBtn = shouldRenderBtn();
  const buttonText = buttonStatusText(statusStaking);

  const buttonAction = () => {
    if (statusStaking === "unapproved") {
      return approve && handleClickApprove();
    } else if (statusStaking === "readyToStake") {
      return stake && handleClickStake();
    } else if (statusStaking === "success") {
      setStatusStaking("unapproved");
    }
  };

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close();
    setValue("stakingAmount", 0);
  };

  useEffect(() => {
    handleStatusStaking({
      needsApproval,
      statusApprove,
      setStatusStaking,
      statusStake,
    });
    console.log("needsAPproval", needsApproval);
    console.log("statusStaking", statusStaking);
    console.log("astAllowance", astAllowance);
    console.log("statusApprove", statusApprove);
    console.log("statusStake", statusStake);
  }, [
    needsApproval,
    astAllowance,
    stakingAmount,
    statusApprove,
    statusStake,
    statusStaking,
  ]);

  return (
    <dialog
      className={twJoin(
        "content-center border border-border-darkGray bg-black p-6 text-white",
        ["w-fit xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3"],
      )}
      ref={stakingModalRef}
    >
      <div className="flex justify-between">
        <h2 className="font-semibold">{headline}</h2>
        <div className="hover:cursor-pointer" onClick={handleCloseModal}>
          <VscChromeClose />
        </div>
      </div>
      {statusStaking === "unapproved" || statusStaking === "readyToStake" ? (
        <ManageStake register={register} setValue={setValue} />
      ) : null}

      {statusStaking === "approving" || statusStaking === "staking" ? (
        <PendingTransaction statusStaking={statusStaking} />
      ) : null}

      {statusStaking === "approved" || statusStaking === "success" ? (
        <ApproveSuccess
          statusStaking={statusStaking}
          // setStatusStaking={setStatusStaking}
          amountApproved={stakingAmount.toString()}
          amountStaked={stakingAmount.toString()}
          chainId={chainId}
          transactionHashApprove={hashApprove?.transactionHash}
          transactionHashStake={hashStake?.transactionHash}
        />
      ) : null}

      {statusStaking === "failed" ? (
        <TransactionFailed
          setStatusStaking={setStatusStaking}
          chainId={chainId}
          transactionHash="0x"
        />
      ) : null}

      {!isShouldRenderBtn && (
        <Button
          className="mb-2 mt-10 w-full rounded-sm bg-accent-blue font-semibold uppercase"
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      )}
    </dialog>
  );
};

export default StakingModal;
