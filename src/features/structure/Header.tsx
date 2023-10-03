import { useAccount } from "wagmi";
import AirSwapLogoWithText from "../../assets/airswap-logo-with-text.svg";
import AirSwapLogo from "../../assets/airswap-logo.svg";
import WalletConnection from "../chain-connection/WalletConnection";
import { StakingButton } from "../staking/StakingButton";

export const Header = ({}: {}) => {
  const { isConnected } = useAccount();
  return (
    <div className="flex h-24 flex-row items-center justify-between px-8">
      <div>
        <div className="h-10 w-10 md:hidden -mr-5">
          <img
            src={AirSwapLogo}
            alt="AirSwap Logo"
            className="h-8 xs:h-10 w-10 -ml-6 xs:-ml-2 mt-1 xs:mt-0"
          />
        </div>
        <img
          src={AirSwapLogoWithText}
          alt="AirSwap Logo"
          className="hidden md:block"
        />
      </div>

      <div className="flex flex-row items-center gap-2 xs:gap-4">
        <WalletConnection />
        {/* {!isConnected ? (
          <>
            <SettingsMenuButton />
            <WalletConnection />
          </>
        ) : (
          <>
            <WalletConnection />
            <SettingsMenuButton />
          </>
        )} */}
        {isConnected ? <StakingButton /> : null}
      </div>
    </div>
  );
};
