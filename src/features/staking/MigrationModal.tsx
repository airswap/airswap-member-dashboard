import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdLaunch } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { waitForTransaction } from "wagmi/actions";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { astAbi } from "../../contracts/astAbi";
import { v3StakingAbi } from "../../contracts/v3StakingAbi";
import { v4StakingAbi } from "../../contracts/v4StakingAbi";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { formatNumber } from "../common/utils/formatNumber";

const MigrationStep = ({
  stepNumber,
  amount,
  description,
  isComplete,
  isNextStep,
  verb,
  transactionHash,
  isLoading,
  buttonAction,
}: {
  stepNumber?: number;
  amount: string;
  verb: string;
  description: string;
  isComplete: boolean;
  isNextStep: boolean;
  isLoading?: boolean;
  transactionHash?: string;
  buttonAction?: () => void;
}) => {
  const { chain } = useNetwork();
  const needsSwitchChain = isNextStep && chain?.id !== 1 && chain?.id !== 5;
  const { switchNetwork } = useSwitchNetwork({ chainId: 1 });

  return (
    <>
      <div
        className={twJoin([
          "grid place-items-center rounded-full w-10 h-10",
          (isNextStep || isComplete) &&
            "bg-airswap-blue text-gray-50 font-bold",
          !isComplete &&
            !isNextStep &&
            "bg-transparent text-gray-300 font-bold border-gray-300 border",
        ])}
      >
        {!isComplete ? (
          <span className="relative -top-px">{stepNumber}</span>
        ) : (
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <motion.path
              key="check"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.8,
              }}
              d="M3,13 L9,19 22,5"
              stroke={"currentColor"}
              strokeWidth={3}
            />
          </svg>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <motion.h3
          className={twJoin(
            "inline-flex gap-2 items-center justify-between",
            isNextStep ? "font-semibold" : !isComplete ? "text-gray-300" : "",
          )}
          animate={{ y: isComplete ? 22 : 0 }}
          transition={{
            ease: "easeOut",
            duration: 0.5,
          }}
        >
          {description}
          {transactionHash && (
            <motion.a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-1 top-px"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{
                ease: "easeOut",
                duration: 1,
                delay: 1,
              }}
            >
              {" "}
              <MdLaunch size={14} />
            </motion.a>
          )}
        </motion.h3>
        <Button
          onClick={needsSwitchChain ? () => switchNetwork?.() : buttonAction}
          color={isNextStep ? "primary" : "transparent"}
          disabled={!isNextStep || isLoading}
          className={twJoin(
            "rounded-none text-sm p-2 transition-all",
            isComplete && "!opacity-0 !pointer-events-none",
          )}
        >
          <AnimatePresence>
            {!isLoading && (
              <motion.span initial={false} exit={{ opacity: 0 }}>
                {needsSwitchChain ? (
                  "Switch to mainnet"
                ) : (
                  <>
                    {verb} {amount} AST
                  </>
                )}
              </motion.span>
            )}
            {isLoading && (
              <motion.span
                className="inline-flex justify-center items-center gap-2 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="-my-2 absolute -left-7 top-2">
                  <AiOutlineLoading
                    className="animate-spin absolute"
                    size={18}
                  />
                </span>
                <span>
                  {verb.replace(/e$/, "")}ing {amount} AST...
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </>
  );
};

export const MigrationModal = ({}: {}) => {
  const [showMigrationModal, setShowMigrationModal] = useState<boolean>(true);
  const [transactionHashes, setTransactionHashes] = useState<`0x${string}`[]>(
    [],
  );
  const [isMining, setIsMining] = useState<boolean[]>([false, false, false]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const { address: connectedAccount } = useAccount();

  const [newStakingContract, oldStakingContract, astContract] =
    useContractAddresses(
      [
        ContractTypes.AirSwapStaking,
        ContractTypes.AirSwapV3Staking_deprecated,
        ContractTypes.AirSwapToken,
      ],
      { defaultChainId: 1, useDefaultAsFallback: true },
    );

  /* ---------------------------- Contract reads ---------------------------- */
  const { data: v3AvailableBalance } = useContractRead({
    abi: v3StakingAbi,
    ...oldStakingContract,
    functionName: "available",
    args: [connectedAccount!],
    enabled: !!connectedAccount,
  });
  const { data: newStakingAstAllowance } = useContractRead({
    abi: astAbi,
    ...astContract,
    functionName: "allowance",
    args: [connectedAccount!, newStakingContract.address!],
    enabled: !!connectedAccount,
    watch: true,
  });

  // Save initial amount so we can show the amount even after it's gone.
  const [initialAmount, setInitialAmount] = useState<bigint>();
  useEffect(() => {
    if (v3AvailableBalance && !initialAmount) {
      setInitialAmount(v3AvailableBalance);
    }
  }, [v3AvailableBalance, initialAmount]);

  const needsApproval =
    initialAmount && initialAmount > (newStakingAstAllowance || 0n);

  /* ---------------------------- Contract writes --------------------------- */

  // Unstake.
  const { config: unstakeConfig } = usePrepareContractWrite({
    abi: v3StakingAbi,
    ...oldStakingContract,
    functionName: "unstake",
    args: [initialAmount!],
    enabled: Boolean(
      connectedAccount && v3AvailableBalance && currentStep === 0,
    ),
  });

  const { write: unstake, isLoading: unstakeLoading } = useContractWrite({
    ...unstakeConfig,
    onSuccess: async (result) => {
      const hash = result.hash;
      setIsMining([true, false, false]);
      await waitForTransaction({
        chainId: oldStakingContract.chainId,
        hash,
      });
      setIsMining([false, false, false]);
      setTransactionHashes((prev) => [...prev, hash]);
      setCurrentStep(needsApproval ? 1 : 2);
    },
  });

  // Approve.
  const { config: approveConfig } = usePrepareContractWrite({
    abi: astAbi,
    ...astContract,
    functionName: "approve",
    args: [newStakingContract.address!, initialAmount!],
    enabled: Boolean(currentStep === 1),
  });

  console.log("approveConfig", approveConfig);

  const { write: approve, isLoading: approveLoading } = useContractWrite({
    ...approveConfig,
    onSuccess: async (result) => {
      const hash = result.hash;
      setIsMining([false, true, false]);
      await waitForTransaction({
        chainId: astContract.chainId,
        hash,
      });
      setIsMining([false, false, false]);
      setTransactionHashes((prev) => [...prev, hash]);
      setCurrentStep(2);
    },
  });

  // Restake.
  const { config: stakeConfig } = usePrepareContractWrite({
    abi: v4StakingAbi,
    ...newStakingContract,
    functionName: "stake",
    args: [initialAmount!],
    enabled: Boolean(currentStep === 2),
  });
  const { write: stake, isLoading: stakeLoading } = useContractWrite({
    ...stakeConfig,
    onSuccess: async (result) => {
      const hash = result.hash;
      setIsMining([false, false, true]);
      await waitForTransaction({
        chainId: newStakingContract.chainId,
        hash,
      });
      setIsMining([false, false, false]);
      setTransactionHashes((prev) => [prev[0], prev[1], hash]);
      setCurrentStep(3);
    },
  });

  const formattedInitialAmount = formatNumber(initialAmount, 4);

  return (
    showMigrationModal &&
    (initialAmount || 0n) > 0n && (
      <Modal
        className="max-w-sm text-white"
        onCloseRequest={() => setShowMigrationModal(false)}
        heading="Migrate to V4!"
        subHeading={
          <span className="[text-wrap:balance]">
            Stake using the new contract to continue voting and earning rewards
          </span>
        }
      >
        <div className="flex flex-col gap-2">
          <p>
            You are currently staking {formattedInitialAmount} AST in the V3
            staking contract.
          </p>
          <p>
            After 31st December 2023 you will no longer be able to vote with AST
            staked in this way. Please migrate at your earliest convenience by
            following the steps below.
          </p>
        </div>

        <div
          className="grid grid-cols-2 mt-8 gap-4 items-center"
          style={{
            gridTemplateColumns: "auto 1fr",
          }}
        >
          <MigrationStep
            verb="Unstake"
            stepNumber={1}
            amount={formattedInitialAmount || ""}
            description="Unstake from the V3 contract"
            isComplete={Boolean(transactionHashes[0])}
            transactionHash={transactionHashes[0]}
            isNextStep={currentStep === 0}
            isLoading={unstakeLoading || isMining[0]}
            buttonAction={unstake}
          />
          <MigrationStep
            verb="Approve"
            stepNumber={2}
            amount={formattedInitialAmount || ""}
            description="Approve the new v4.2 staking contract"
            isComplete={!needsApproval || Boolean(transactionHashes[1])}
            transactionHash={transactionHashes[1]}
            isNextStep={currentStep === 1}
            isLoading={approveLoading || isMining[1]}
            buttonAction={approve}
          />

          <MigrationStep
            verb="Stake"
            stepNumber={3}
            amount={formattedInitialAmount || ""}
            description="Stake using the latest v4.2 contract"
            isComplete={Boolean(transactionHashes[2])}
            isNextStep={currentStep === 2}
            isLoading={stakeLoading || isMining[2]}
            buttonAction={stake}
            transactionHash={transactionHashes[2]}
          />

          <motion.div
            animate={{ height: currentStep === 3 ? "auto" : "0" }}
            initial={{ height: 0 }}
            className="col-span-full overflow-hidden"
          >
            <hr className=" border-gray-800 -mx-6 mb-6" />
            <div className="flex flex-row justify-between items-center gap-4">
              <div>
                <div>All done!</div>
                <div>The migration is now complete</div>
              </div>
              <Button
                color="primary"
                onClick={() => setShowMigrationModal(false)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      </Modal>
    )
  );
};
