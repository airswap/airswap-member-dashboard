import { Dispatch, FC, MouseEvent, RefObject, useEffect, useState } from "react"
import { useClickOutside } from '@react-hookz/web';
import { languageOptions } from "../../utils/languageOptions";
import { themeOptions } from "../../utils/themeOptions";
import { VscGithubInverted } from 'react-icons/vsc'
import { TextWithLineAfter } from "../common/TextWithLineAfter";
import useSettingsStore from "../../store/store";
import { formatDate } from "../../utils/formatDate";


interface SettingsPopoverProps {
  settingsPopoverRef: RefObject<HTMLDivElement>
  setIsSettingsPopoverOpen: Dispatch<boolean>
}

const SettingsPopover: FC<SettingsPopoverProps> = ({ settingsPopoverRef, setIsSettingsPopoverOpen }) => {
  const [latestCommit, setLatestCommit] = useState<string | undefined>(undefined)
  const [latestCommitLink, setLatestCommitLink] = useState<string | undefined>(undefined);
  const [latestCommitDate, setLatestCommitDate] = useState<Date | undefined>(undefined)


  const { theme, selectedLanguage, setTheme, setLanguage } = useSettingsStore();
  console.log(theme)

  const formattedCommitDate = formatDate(latestCommitDate)

  const handleThemeChange = (e: MouseEvent<HTMLButtonElement>) => {
    setTheme(e.currentTarget.value)
    localStorage.theme = e.currentTarget.value;

    if (e.currentTarget.value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const handleLanguageChange = (e: MouseEvent<HTMLButtonElement>) => {
    setLanguage(e.currentTarget.value)
  }

  const handleClosePopoverOnOutsideClick = useClickOutside(
    settingsPopoverRef,
    () => setIsSettingsPopoverOpen(false),
    ['keydown', 'mousedown']
  )

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (theme === 'dark') {
      localStorage.theme = 'dark'
    } else if (theme === 'light') {
      localStorage.theme = 'light'
    } else {
      localStorage.removeItem('theme')
    }
  }, [theme])

  useEffect(() => {
    const url = 'https://api.github.com/repos/airswap/airswap-voter-rewards/commits';

    fetch(url)
      .then((response) => response.json())
      .then((commits) => {
        const latestCommit = commits[0];
        const sha = latestCommit.sha;
        const date = latestCommit.commit.author.date;

        setLatestCommit(sha)
        setLatestCommitDate(new Date(date))
        setLatestCommitLink(latestCommit.html_url)
      })
      .catch((error) => console.error('Error fetching commits:', error));
  }, [])

  return (
    <div
      className='absolute sm:right-60 top-20 py-2 px-4 rounded-md border border-border-lightLightGray dark:border-border-darkGray font-medium text-sm text-font-darkSubtext bg-bg-lightSecondary dark:bg-bg-darkShaded'
      ref={settingsPopoverRef}
      onClick={() => handleClosePopoverOnOutsideClick}
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
        {languageOptions.map(language => {
          const isSelected = language.value === selectedLanguage
          return (
            <button
              className={`px-4 py-2 text-left font-normal hover:text-font-lightBluePrimary dark:hover:text-font-darkPrimary ${isSelected && "bg-bg-lightGray dark:bg-border-darkGray text-font-lightBluePrimary dark:text-font-darkPrimary font-semibold"}`}
              onClick={handleLanguageChange}
              value={language.value}
              key={language.value}
            >
              {language.label}
            </button>
          )
        }
        )}
      </div>
      <hr className="my-2 w-full absolute left-0 border-t-1 dark:border-border-darkGray" />
      <footer className="flex content-center border-width-full text-xs">
        <div className="flex items-center my-4">
          <a href="https://github.com/airswap/airswap-voter-rewards" target="_" className="px-4 py-3 border dark:border-border-darkGray hover:border-border-darkLight">
            <div>
              <VscGithubInverted color={theme === 'light' ? 'black' : 'white'} size='16' />
            </div>
          </a>

          <a href={latestCommitLink} target="_" className="px-4 py-3 border-t border-b dark:border-border-darkGray hover:border-border-darkLight">
            <div>
              {latestCommit?.slice(0, 6)}
            </div>
          </a>
          <a href={latestCommitLink} target="_" className="px-4 py-3 border dark:border-border-darkGray hover:border-border-darkLight">
            <div>
              {formattedCommitDate}
            </div>
          </a>
        </div>
      </footer>
    </div >
  )
}

export default SettingsPopover
