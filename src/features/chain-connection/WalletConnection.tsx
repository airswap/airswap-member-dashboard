import { useAccount, useEnsName, useDisconnect } from "wagmi";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";
import truncateEthAddress from "truncate-eth-address";
import { FC, Dispatch } from "react";

interface WalletConnectionProps {
  setRenderWalletConnectModal: Dispatch<boolean>
}

export const WalletConnection: FC<WalletConnectionProps> = ({ setRenderWalletConnectModal }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const { disconnect } = useDisconnect()

  return (
    <Button
      className={twJoin([
        "flex flex-row items-center gap-2",
        isConnected && "cursor-default",
      ])}
      onClick={() => !isConnected ? setRenderWalletConnectModal(true) : disconnect()}
    >
      <div className="h-3 w-3 rounded-full bg-accent-green"></div>
      <span className="font-medium">
        {isConnected ? ensName || truncateEthAddress(address || "") : "Connect"}
      </span>
    </Button>
  );
};
