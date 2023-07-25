import { MdSettings } from "react-icons/md";
import { Button } from "../common/Button";
export const SettingsMenuButton = ({}: {}) => {
  return (
    <Button className="aspect-square px-4">
      <MdSettings />
    </Button>
  );
};
