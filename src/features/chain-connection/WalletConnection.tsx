import { useAccount, useConnect, useEnsName } from "wagmi";
import { Button } from "../common/Button";
import { InjectedConnector } from "wagmi/connectors/injected";
import { twJoin } from "tailwind-merge";
import truncateEthAddress from "truncate-eth-address";

// TODO: this component should actually open a modal instead of defaulting to
// the injected connector

export const WalletConnection = ({}: {}) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <Button
      className={twJoin([
        "flex flex-row gap-2 items-center",
        isConnected && "cursor-default",
      ])}
      onClick={() => (isConnected ? () => {} : connect())}
    >
      <div className="w-3 h-3 rounded-full bg-accent-green"></div>
      <span className="font-medium">
        {isConnected ? ensName || truncateEthAddress(address || "") : "Connect"}
      </span>
    </Button>
  );
};
