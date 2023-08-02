import AirSwapLogo from "../../assets/airswap-logo.svg";
import AirSwapLogoWithText from "../../assets/airswap-logo-with-text.svg";
import { SettingsMenuButton } from "../settings/SettingsMenuButton";
import { WalletConnection } from "../chain-connection/WalletConnection";
import { StakeButton } from "../staking/StakeButton";

export const Header = ({}: {}) => {
  return (
    <div className="flex h-24 flex-row items-center justify-between px-8">
      <div>
        <div className="md:hidden w-10 h-10">
          <img src={AirSwapLogo} alt="AirSwap Logo" className='w-10 h-10'/>
        </div>
        <img
          src={AirSwapLogoWithText}
          alt="AirSwap Logo"
          className="hidden md:block"
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <WalletConnection />
        <SettingsMenuButton />
        <StakeButton />
      </div>
    </div>
  );
};
