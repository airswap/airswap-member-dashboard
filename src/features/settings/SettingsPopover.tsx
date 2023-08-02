import { Dispatch, FC, MouseEvent, RefObject, useEffect, useState } from "react"
import { useClickOutside } from '@react-hookz/web';
import { languageOptions } from "../../utils/languageOptions";
import { themeOptions } from "../../utils/themeOptions";
import { VscGithub, VscGithubInverted } from 'react-icons/vsc'
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


  const { selectedTheme, selectedLanguage, setTheme, setLanguage } = useSettingsStore();

  const formattedCommitDate = formatDate(latestCommitDate)

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
      className='absolute sm:right-60 top-20 bg-border-darkShaded py-2 px-4 rounded-md border border-border-darkGray font-medium text-sm text-font-darkSubtext'
      ref={settingsPopoverRef}
      onClick={() => handleClosePopoverOnOutsideClick}
    >
      <TextWithLineAfter className="mt-1">THEME</TextWithLineAfter>
      <div className="flex flex-row">
        {themeOptions.map((theme) => {
          const isSelected = theme.value === selectedTheme
          return (
            <button
              className={`px-5 py-3 w-1/3 text-center font-normal border border-border-darkGray hover:text-font-darkPrimary hover:border-border-darkLight ${isSelected && "bg-border-darkGray text-font-darkPrimary font-semibold"}`}
              onClick={handleThemeChange}
              value={theme.value}
              key={theme.value}
            >
              {theme.label}
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
              className={`px-4 py-2 text-left font-normal hover:text-font-darkPrimary ${isSelected && "bg-border-darkGray text-font-darkPrimary font-semibold"}`}
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
      <footer className="flex content-center border-t border-width-full border-border-darkGray mt-2 text-xs">
        <div className="flex items-center my-4">
          <a href="https://github.com/airswap/airswap-voter-rewards" target="_" className="px-4 py-3.5 border border-border-darkGray hover:border-border-darkLight">
            <div className="">
              <VscGithubInverted />
            </div>
          </a>

          <a href={latestCommitLink} target="_" className="px-4 py-3.5 border border-border-darkGray hover:border-border-darkLight">
            <div className="">
              {latestCommit?.slice(0, 6)}
            </div>
          </a>
          <a href={latestCommitLink} target="_" className="px-4 py-3.5 border border-border-darkGray hover:border-border-darkLight">
            <div className="">
              {formattedCommitDate}
            </div>
          </a>
        </div>
      </footer>
    </div >
  )
}

export default SettingsPopover
