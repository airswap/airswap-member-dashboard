import { Button } from "../common/Button";

export const WalletConnection = ({}: {}) => {
  return (
    <Button className="flex flex-row gap-2 items-center">
      <div className="w-3 h-3 rounded-full bg-accent-green"></div>
      <span className="font-medium">0x123…456</span>
    </Button>
  );
};
