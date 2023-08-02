import { MdSettings } from "react-icons/md";
import { Button } from "../common/Button";
import SettingsPopover from "./SettingsPopover";
import { useRef, useState } from "react";

export const SettingsMenuButton = ({ }: {}) => {
  const [isSettingsPopoverOpen, setIsSettingsPopoverOpen] = useState<boolean>(false);

  const settingsPopoverRef = useRef<HTMLDivElement | null>(null)

  const handleOpenSettingsPopover = () => {
    setIsSettingsPopoverOpen(!isSettingsPopoverOpen)
  }

  return (
    <>
      <Button className="relative aspect-square px-4" onClick={handleOpenSettingsPopover}>
        <MdSettings />
      </Button>

      {isSettingsPopoverOpen && (
        <SettingsPopover settingsPopoverRef={settingsPopoverRef} setIsSettingsPopoverOpen={setIsSettingsPopoverOpen} />
      )}
    </>
  );
};
