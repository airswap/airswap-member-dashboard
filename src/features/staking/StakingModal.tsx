import { FC, RefObject, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VscChromeClose } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { useApproveToken } from "./hooks/useApproveToken";
import { useAstAllowance } from "./hooks/useAstAllowance";
import { useStakeAst } from "./hooks/useStakeAst";
import { useUnstakeSast } from "./hooks/useUnstakeSast";
import ApproveSuccess from "./subcomponents/ApproveSuccess";
import ManageStake from "./subcomponents/ManageStake";
import PendingTransaction from "./subcomponents/PendingTransaction";
import TransactionFailed from "./subcomponents/TransactionFailed";
import { StakeOrUnstake, StakingStatus } from "./types/StakingTypes";
import { handleStatusStaking } from "./utils/handleStatusStaking";
import {
  buttonStatusText,
  handleButtonActions,
  modalHeadline,
  shouldRenderButton,
} from "./utils/helpers";

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
  const [stakeOrUnstake, setStakeOrUnstake] = useState<StakeOrUnstake>("stake");

  const {
    register,
    watch,
    setValue,
    // formState: { errors },
  } = useForm<{ stakingAmount: number }>();
  const stakingAmount = watch("stakingAmount") || 0;

  const { astAllowanceFormatted: astAllowance } = useAstAllowance();
  const { sAstBalanceFormatted } = useTokenBalances();

  const needsApproval =
    stakingAmount > 0 ? Number(astAllowance) < stakingAmount : true;
  const canUnstake =
    stakingAmount > 0 && stakingAmount <= Number(sAstBalanceFormatted);

  const { approve, approveReset, hashApprove, statusApprove } = useApproveToken(
    {
      stakingAmount,
      needsApproval,
      setStatusStaking,
    },
  );

  const { stake, writeResetStake, transactionDataStake, statusStake } =
    useStakeAst({
      stakingAmount,
      needsApproval,
      setStatusStaking,
    });

  const { unstake, writeResetUnstake, statusUnstake, transactionDataUnstake } =
    useUnstakeSast({
      unstakingAmount: stakingAmount,
      canUnstake,
    });

  // button should not render on certain components
  const isRenderButton = shouldRenderButton(
    stakeOrUnstake,
    statusStaking,
    statusUnstake,
  );
  console.log(stakeOrUnstake);

  const buttonText = buttonStatusText({
    statusStaking,
    stakeOrUnstake,
    statusUnstake,
  });
  const headline = modalHeadline(statusStaking);

  const shouldRenderManageStake =
    (statusUnstake !== "success" &&
      statusUnstake !== "loading" &&
      statusStaking === "unapproved") ||
    statusStaking === "readyToStake";

  const shouldRenderPendingTransaction =
    statusStaking === "approving" ||
    statusStaking === "staking" ||
    statusUnstake === "loading";

  const shouldRenderApproveSuccess =
    statusStaking === "approved" ||
    statusStaking === "success" ||
    statusUnstake === "success";

  const shouldRenderTransactionFailed =
    statusStaking === "failed" || statusUnstake === "error";

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close();
    setValue("stakingAmount", 0);
  };

  useEffect(() => {
    handleStatusStaking({
      stakeOrUnstake,
      needsApproval,
      statusApprove,
      setStatusStaking,
      statusStake,
      stakeHash: transactionDataStake?.transactionHash,
    });
  }, [
    stakeOrUnstake,
    needsApproval,
    astAllowance,
    statusApprove,
    statusStake,
    transactionDataStake,
    statusStaking,
  ]);
  console.log(
    "stakeOrUnstake",
    stakeOrUnstake,
    "statusStaking",
    statusStaking,
    "statusUnstake",
    statusUnstake,
  );

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
      {shouldRenderManageStake ? (
        <ManageStake
          register={register}
          setValue={setValue}
          stakeOrUnstake={stakeOrUnstake}
          setStakeOrUnstake={setStakeOrUnstake}
        />
      ) : null}

      {shouldRenderPendingTransaction ? (
        <PendingTransaction
          statusStaking={statusStaking}
          statusUnstake={statusUnstake}
        />
      ) : null}

      {shouldRenderApproveSuccess ? (
        <ApproveSuccess
          stakeOrUnstake={stakeOrUnstake}
          statusStaking={statusStaking}
          statusUnstake={statusUnstake}
          amountApproved={stakingAmount.toString()}
          amountStaked={stakingAmount.toString()}
          amountUnstaked={stakingAmount.toString()}
          chainId={chainId}
          transactionHashApprove={hashApprove?.transactionHash}
          transactionHashStake={transactionDataStake?.transactionHash}
          transactionHashUnstake={transactionDataUnstake?.transactionHash}
        />
      ) : null}

      {shouldRenderTransactionFailed ? (
        <TransactionFailed
          chainId={chainId}
          // TODO: replace transactionHash
          transactionHash="0x"
        />
      ) : null}

      {isRenderButton && (
        <Button
          className="mb-2 mt-10 w-full rounded-sm bg-accent-blue font-semibold uppercase"
          onClick={() => {
            handleButtonActions({
              stakeOrUnstake,
              statusStaking,
              approve,
              stake,
              approveReset,
              writeResetStake,
              setValue,
              setStatusStaking,
              needsApproval,
              statusUnstake,
              unstake,
              writeResetUnstake,
            });
          }}
          disabled={stakingAmount <= 0}
        >
          {buttonText}
        </Button>
      )}
    </dialog>
  );
};

export default StakingModal;
