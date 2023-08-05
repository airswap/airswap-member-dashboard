import { Dispatch, FC, MouseEvent, RefObject } from "react"
import { useClickOutside } from '@react-hookz/web';
import { languageOptions } from "../../utils/languageOptions";
import { themeOptions } from "../../utils/themeOptions";
import { VscGithubInverted } from 'react-icons/vsc'
import { TextWithLineAfter } from "../common/TextWithLineAfter";
import { Theme, useThemeStore } from "../../store/themeStore";
import { useLanguageStore } from "../../store/languageStore";
import { twJoin } from "tailwind-merge";

interface SettingsPopoverProps {
  settingsPopoverRef: RefObject<HTMLDivElement>
  togglePopover: Dispatch<boolean>
}

const SettingsPopover: FC<SettingsPopoverProps> = ({ settingsPopoverRef, togglePopover }) => {
  const { theme, setTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()

  const handleThemeChange = (e: MouseEvent<HTMLButtonElement>) => {
    const newTheme = e.currentTarget.value as Theme
    setTheme(newTheme)
  }

  const handleLanguageChange = (e: MouseEvent<HTMLButtonElement>) => {
    setLanguage(e.currentTarget.value)
  }

  useClickOutside(
    settingsPopoverRef,
    () => togglePopover(false),
    ['click', 'keydown']
  )

  return (
    <div
      className={twJoin(
        ['absolute top-20 py-2 px-4 rounded-md font-medium text-sm text-font-darkSubtext border border-border-lightLightGray bg-bg-lightSecondary'],
        ['sm: right - 60'],
        ['dark:border-border-darkGray dark:bg-bg-darkShaded'],
      )}
      ref={settingsPopoverRef}
    >
      <TextWithLineAfter className="mt-1">THEME</TextWithLineAfter>
      <div className="flex flex-row">
        {themeOptions.map((themeOption) => {
          const isSelected = themeOption.value === theme;
          return (
            <button
              className={`px-4 py-2 w-1/3 text-center font-normal border dark:border-border-darkGray hover:border-border-darkLight ${isSelected && "bg-bg-lightGray dark:bg-border-darkGray dark:text-font-darkPrimary text-font-lightBluePrimary font-semibold"}`}
              onClick={handleThemeChange}
              value={themeOption.value}
              key={themeOption.value}
            >
              {themeOption.label}
            </button>
          )
        }
        )}
      </div>
      <TextWithLineAfter>LANGUAGE</TextWithLineAfter>
      <div className="flex flex-col h-40 overflow-auto mb-3">
        {languageOptions.map(languageOption => {
          const isSelected = languageOption.value === language
          return (
            <button
              className={twJoin(
                ['px-4', 'py-2', 'text-left', 'font-normal'],
                ['hover:text-font-lightBluePrimary', 'dark:hover:text-font-darkPrimary'],
                isSelected
                  ? ['bg-bg-lightGray', 'dark:bg-border-darkGray', 'text-font-lightBluePrimary', 'dark:text-font-darkPrimary', 'font-semibold']
                  : []
              )}
              onClick={handleLanguageChange}
              value={languageOption.value}
              key={languageOption.value}
            >
              {languageOption.label}
            </button>
          )
        }
        )}
      </div>
      <hr className={twJoin(
        ['my-2 w-full absolute left-0 border-t-1'],
        ['dark:border-border-darkGray'])} />
      <footer className="flex content-center border-width-full text-xs">
        <div className="flex items-center my-4">
          <a href="https://github.com/airswap/airswap-voter-rewards" target="_" className={twJoin(
            ['px-4 py-3 border'],
            ['dark:border-border-darkGray'],
            ['hover:border-border-darkLight'])}>
            <div>
              <VscGithubInverted color={theme === 'dark' ? 'white' : 'black'} size='16' />
            </div>
          </a>

          <a
            href="#"
            target="_"
            className={twJoin(
              ['px-4', 'py-3', 'border-t', 'border-b'],
              ['dark:border-border-darkGray'],
              ['hover:border-border-darkLight']
            )}
          >
            <div>
              {/* TODO: replace with dynamic name of last commit */}
              2ac00c
            </div>
          </a>
          <a
            href="#"
            target="_"
            className={twJoin(
              ['px-4', 'py-3', 'border'],
              ['dark:border-border-darkGray'],
              ['hover:border-border-darkLight']
            )}>
            <div>
              {/* {formattedCommitDate} */}
              2023-08-08
            </div>
          </a>
        </div>
      </footer>
    </div >
  )
}

export default SettingsPopover
