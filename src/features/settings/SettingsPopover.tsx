import { Dispatch, FC, MouseEvent, RefObject } from "react"
import { useClickOutside } from '@react-hookz/web';
import { languageOptions } from "../../utils/languageOptions";
import { themeOptions } from "../../utils/themeOptions";
import { VscGithub, VscGithubInverted } from 'react-icons/vsc'
import { TextWithLineAfter } from "../common/TextWithLineAfter";
import useSettingsStore from "../../store/store";


interface SettingsPopoverProps {
  settingsPopoverRef: RefObject<HTMLDivElement>
  setIsSettingsPopoverOpen: Dispatch<boolean>
}

const SettingsPopover: FC<SettingsPopoverProps> = ({ settingsPopoverRef, setIsSettingsPopoverOpen }) => {
  const { selectedTheme, selectedLanguage, setTheme, setLanguage } = useSettingsStore();

  const handleThemeChange = (e: MouseEvent<HTMLButtonElement>) => {
    setTheme(e.currentTarget.value)
  }

  const handleLanguageChange = (e: MouseEvent<HTMLButtonElement>) => {
    setLanguage(e.currentTarget.value)
  }

  const handleClosePopoverOnOutsideClick = useClickOutside(
    settingsPopoverRef,
    () => setIsSettingsPopoverOpen(false),
    ['keydown', 'mousedown']
  )

  return (
    <div
      className='absolute sm:right-60 top-20 bg-border-darkShaded py-2 px-4 rounded-md border border-border-darkLight w-fit font-medium text-sm text-font-darkSubtext'
      ref={settingsPopoverRef}
      onClick={() => handleClosePopoverOnOutsideClick}
    >
      <TextWithLineAfter className="mt-2">THEME</TextWithLineAfter>
      <div className="flex flex-row">
        {themeOptions.map((theme) =>
          <button
            className={`px-5 py-3 w-1/3 text-center font-normal border border-border-darkLight hover:bg-border-darkLight hover:text-font-darkActive hover:font-medium ${theme.value === selectedTheme ? "bg-border-darkLight" : null}`}
            onClick={handleThemeChange}
            value={theme.value}
            key={theme.value}
          >
            {theme.label}
          </button>
        )}
      </div>
      <TextWithLineAfter>LANGUAGE</TextWithLineAfter>
      <div className="flex flex-col h-40 overflow-y-auto">
        {languageOptions.map(language =>
          <button
            className={`px-4 py-2 text-left hover:bg-border-darkLight font-normal hover:text-font-darkActive hover:font-medium ${language.value === selectedLanguage ? "bg-border-darkLight" : null}`}
            onClick={handleLanguageChange}
            value={language.value}
            key={language.value}
          >
            {language.label}
          </button>
        )}
      </div>
      <footer className="border-t border-width-full border-border-darkLight mt-2 text-xs">
        <div className="flex my-4">
          <div className="px-4 py-4 border border-border-darkLight">
            <a href="https://github.com/airswap/airswap-voter-rewards" target="_">
              <VscGithubInverted />
            </a>
          </div>
          <div className="px-4 py-3 border border-border-darkLight">
            {/* TODO: replace with latest git commit */}
            2ce567b
          </div>
          <div className="px-4 py-3 border border-border-darkLight">
            {/* TODO: replace with latest git commit date */}
            2022-06-09
          </div>
        </div>
      </footer>
    </div >
  )
}

export default SettingsPopover
