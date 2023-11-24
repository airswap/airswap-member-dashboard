import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { astAbi } from "../../contracts/astAbi";
import { v3StakingAbi } from "../../contracts/v3StakingAbi";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { formatNumber } from "../common/utils/formatNumber";

export const MigrationModal = ({}: {}) => {
  const [showMigrationModal, setShowMigrationModal] = useState<boolean>(true);

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
  const { data: v3StakingBalance } = useContractRead({
    abi: v3StakingAbi,
    ...oldStakingContract,
    functionName: "balanceOf",
    args: [connectedAccount!],
    enabled: !!connectedAccount,
  });
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

  /* ---------------------------- Contract writes --------------------------- */
  const { config: unstakeConfig } = usePrepareContractWrite({
    abi: v3StakingAbi,
    ...oldStakingContract,
    functionName: "unstake",
    args: [v3AvailableBalance!],
    enabled: Boolean(connectedAccount && v3AvailableBalance),
  });
  const { write: unstake, isLoading: unstakeLoading } =
    useContractWrite(unstakeConfig);

  // Save initial amount so we can show the amount even after it's gone.
  const [initialAmount, setInitialAmount] = useState<bigint>();
  useEffect(() => {
    if (v3AvailableBalance) {
      setInitialAmount(v3AvailableBalance);
    }
  }, [v3AvailableBalance]);

  const needsApproval =
    initialAmount && initialAmount > (newStakingAstAllowance || 0n);
  const isFullMigration =
    v3StakingBalance === 0n || v3AvailableBalance === v3StakingBalance;

  const formattedInitialAmount = formatNumber(initialAmount, 4);

  return (
    showMigrationModal && (
      <Modal
        className="max-w-sm"
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
          <div className="grid place-items-center rounded-full w-10 h-10 bg-airswap-blue text-gray-50 font-bold">
            <span className="relative -top-px left-px">1</span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Unstake from the V3 contract</h3>
            <Button color="primary" className="rounded-none text-sm p-2">
              Unstake {formattedInitialAmount} AST
            </Button>
          </div>

          <div className="grid place-items-center rounded-full w-10 h-10 bg-transparent text-gray-300 font-bold border-gray-300 border">
            <span className="relative -top-px left-px">2</span>
          </div>
          <div className="flex flex-col gap-2 text-gray-300">
            <h3 className="">Approve the new staking contract</h3>
            <Button
              color="transparent"
              className="rounded-none text-sm p-2 text-gray-400"
            >
              Approve {formattedInitialAmount} AST
            </Button>
          </div>

          <div className="grid place-items-center rounded-full w-10 h-10 bg-transparent text-gray-300 font-bold border-gray-300 border">
            <span className="relative -top-px left-px">3</span>
          </div>
          <div className="flex flex-col gap-2 text-gray-300">
            <h3 className="">Stake using the new contract</h3>
            <Button
              color="transparent"
              className="rounded-none text-sm p-2 text-gray-400"
            >
              Stake {formattedInitialAmount} AST
            </Button>
          </div>
        </div>
      </Modal>
    )
  );
};
