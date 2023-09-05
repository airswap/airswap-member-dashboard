import { useNetwork } from "wagmi";

/**
 * @remarks if user is not connected to supported chains (Mainnet 1, or Goerli 5), this hook will prompt user to switch to Mainnet
 * @returns void
 */
export const useConnectToValidChain = async () => {
  const { chain } = useNetwork();

  if (chain?.id === 1 || chain?.id === 5) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const e = error as { code?: number; message: string };
      if (e.code === 4902) {
        // ...
      } else {
        console.error(e.message);
      }
    } else {
      console.error("Caught an unusual error:", error);
    }
  }
};
