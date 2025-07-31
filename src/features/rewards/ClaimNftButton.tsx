import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { Button } from "../common/Button";
import { ClaimNftRewardForm } from "./ClaimNftRewardForm";
import { useState } from "react";
import { Modal } from "../common/Modal";
import { requiredBalanceForNftClaim } from "./config";
import { formatNumber } from "../common/utils/formatNumber";
import { CheckMark } from "../common/icons/CheckMark";
import { MdClose } from "react-icons/md";

export const ClaimNftButton = () => {
  const { isConnected } = useAccount();
  const [showClaimNftModal, setShowClaimNftModal] = useState(false);
  const { sAstBalanceRaw, sAstBalanceV4_DeprecatedRaw } = useTokenBalances();

  const totalSastBalance = sAstBalanceRaw + sAstBalanceV4_DeprecatedRaw;
  const formattedRequiredBalance = formatNumber(requiredBalanceForNftClaim, 4, { minimumSignificantDigits: 4, maximumSignificantDigits: 4 });
  // const isBalanceEnough = !!totalSastBalance && totalSastBalance >= requiredBalanceForNftClaim;
  const isBalanceEnough = true;
  const isEligible = isConnected && isBalanceEnough;

  return (
    <>
      {isEligible && (
        <div
          className={twJoin(
            "flex flex-row items-center gap-4 ring-1 ring-gray-800 max-h-[48px] rounded-full ml-5 md:pl-5 md:pr-[20px]",
          )}
        >
          <span className="hidden md:flex font-medium text-xs lg:text-base truncate">
            <span className="hidden mr-1 lg:inline">Free</span> AirSwap NFT
          </span>

          <Button
            className="md:-mr-5 -my-px truncate"
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
          heading={isEligible ? "Eligible for free mint" : "Not eligible for free mint"}
          subHeading={
            <div className="flex flex-row items-center">
              <span>{`Required: ${formattedRequiredBalance} sAST`}</span>
              <span
                className={twJoin("ml-1", isEligible ? "text-green-400" : "text-red-400")}
              >
                {isEligible ? <CheckMark /> : <MdClose />}
              </span>
            </div>
          }
        >
          <ClaimNftRewardForm />
        </Modal>
      )}
    </>
  );
};
