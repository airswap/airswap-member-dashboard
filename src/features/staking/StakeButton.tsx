import { format } from "@greypixel_/nicenumbers";
import { useAccount, useBalance } from "wagmi";
import { Button } from "../common/Button";

export const StakeButton = ({}: {}) => {
  const { address } = useAccount();
  const { data: sAstBalance } = useBalance({
    token: "0x579120871266ccd8De6c85EF59E2fF6743E7CD15",
    address,
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });

  const formattedBalance =
    format(sAstBalance?.value, { tokenDecimals: 4 }) + " sAST";

  return (
    <div className="flex flex-row items-center gap-4 border border-border-dark px-5 py-3">
      <span className="font-medium">{formattedBalance}</span>
      <Button className="-my-3 -mr-5 bg-accent-blue font-bold uppercase">
        Stake
      </Button>
    </div>
  );
};
