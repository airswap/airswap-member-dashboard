import { format } from "@greypixel_/nicenumbers";
import { useAccount, useBalance } from "wagmi";
import { ContractTypes } from "../../config/ContractAddresses";
import { useContractAddresses } from "../../config/hooks/useContractAddress";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";

export const StakeButton = ({}: {}) => {
  const { address } = useAccount();
  const [stakedAst] = useContractAddresses([ContractTypes.AirSwapStaking], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  const { data: sAstBalance } = useBalance({
    token: stakedAst.address,
    address,
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    chainId: stakedAst.chainId,
  });

  const formattedBalance =
    format(sAstBalance?.value, { tokenDecimals: 4 }) + " sAST";

  return (
    <div
      className={twJoin([
        "flex flex-row items-center gap-4 px-5 py-3",
        "rounded-full border border-border-dark",
      ])}
    >
      <span className="hidden font-medium xs:flex">{formattedBalance}</span>
      <Button className="-my-3 -mr-5 bg-accent-blue font-bold uppercase">
        Stake
      </Button>
    </div>
  );
};
