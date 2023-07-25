import AirSwapLogo from "../../assets/airswap-logo.svg";
import AirSwapLogoWithText from "../../assets/airswap-logo-with-text.svg";
import { SettingsMenuButton } from "../settings/SettingsMenuButton";
import { WalletConnection } from "../wallet/WalletConnection";
import { StakeButton } from "../staking/StakeButton";

export const Header = ({}: {}) => {
  return (
    <div className="flex flex-row justify-between items-center h-24 px-8">
      <div>
        <img src={AirSwapLogo} alt="AirSwap Logo" className="md:hidden" />
        <img
          src={AirSwapLogoWithText}
          alt="AirSwap Logo"
          className="hidden md:block"
        />
      </div>

      <div className="flex flex-row gap-4 items-center">
        <WalletConnection />
        <SettingsMenuButton />
        <StakeButton />
      </div>
    </div>
  );
};
