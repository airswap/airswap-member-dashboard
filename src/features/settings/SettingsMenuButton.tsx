import { MdSettings } from "react-icons/md";
import { Button } from "../common/Button";
import SettingsPopover from "./SettingsPopover";
import { useState } from "react";

export const SettingsMenuButton = ({ }: {}) => {
  const [isSettingsPopoverOpen, setIsSettingsPopoverOpen] = useState<boolean>(false);

  const handleOpenSettingsPopover = () => {
    setIsSettingsPopoverOpen(!isSettingsPopoverOpen)
    console.log(isSettingsPopoverOpen)
  }

  return (
    <>
      <Button className="relative aspect-square px-4" onClick={handleOpenSettingsPopover}>
        <MdSettings />
      </Button>

      {isSettingsPopoverOpen && (
        <SettingsPopover setIsSettingsPopoverOpen={setIsSettingsPopoverOpen} />
      )}
    </>
  );
};
