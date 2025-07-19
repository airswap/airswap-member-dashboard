import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { formatNumber } from "../common/utils/formatNumber";
import { ClaimNftRewardForm } from "./ClaimNftRewardForm";
import { useState } from "react";
import { Modal } from "../common/Modal";

export const ClaimNftButton = () => {
  const { isConnected } = useAccount();
  const [showClaimNftModal, setShowClaimNftModal] = useState(false);
  const { sAstBalanceRaw, sAstBalanceV4_DeprecatedRaw } = useTokenBalances();

  const totalSastBalance = sAstBalanceRaw + sAstBalanceV4_DeprecatedRaw;
  const formattedTotalSastBalance = formatNumber(totalSastBalance, 4);
  const requiredBalance = 100000n;
  const isBalanceEnough = !!totalSastBalance && totalSastBalance >= requiredBalance;

  return (
    <>
      {isConnected && isBalanceEnough && (
        <div
          className={twJoin(
            "flex flex-row items-center gap-4 ring-1 ring-gray-800 max-h-[48px] rounded-full ml-5 md:pl-5 md:pr-[20px]",
          )}
        >
          <span className="hidden md:flex font-medium text-xs lg:text-base truncate">
            <span className="hidden mr-1 lg:inline">Free</span> AirSwap NFT
          </span>

          <Button
            className="-mr-5 -my-px truncate"
            rounded={true}
            color="primary"
            onClick={() => setShowClaimNftModal(true)}
          >
            Claim
          </Button>
        </div>
      )}

      {showClaimNftModal && (
        <Modal
          onCloseRequest={() => setShowClaimNftModal(false)}
          heading="Claim NFT Reward"
        >
          <ClaimNftRewardForm />
        </Modal>
      )}
    </>
  );
};
