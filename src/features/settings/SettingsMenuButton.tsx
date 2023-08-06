import { MdSettings } from "react-icons/md";
import { Button } from "../common/Button";
import SettingsPopover from "./SettingsPopover";
import { useRef } from "react";
import { useToggle } from '@react-hookz/web';

export const SettingsMenuButton = ({ }: {}) => {
  const [isToggled, toggle] = useToggle(false)
  const settingsPopoverRef = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <Button
        className="relative aspect-square px-4"
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}>
        <MdSettings />
      </Button>

      {isToggled ?
        <SettingsPopover settingsPopoverRef={settingsPopoverRef} togglePopover={toggle} />
        : null}
    </>
  );
};
