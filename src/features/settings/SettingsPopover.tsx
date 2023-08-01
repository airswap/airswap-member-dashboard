import { Dispatch, FC, MouseEvent, useState } from "react"
import { languageOptions } from "../../utils/languageOptions";
import { themeOptions } from "../../utils/themeOptions";
import { VscGithub, VscGithubInverted } from 'react-icons/vsc'

interface SettingsPopoverProps {
  setIsSettingsPopoverOpen: Dispatch<boolean>
}

const SettingsPopover: FC<SettingsPopoverProps> = ({ setIsSettingsPopoverOpen }) => {
  // TODO: put into Context
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [selectedTheme, setSelectedTheme] = useState<string>('system')

  // TODO: put into Context
  const handleLanguageChange = (e: MouseEvent<HTMLButtonElement>) => {
    setSelectedLanguage(e.currentTarget.value)
    console.log(selectedLanguage)
  }

  return (
    <div className='absolute bg-border-darkShaded right-60 top-20 py-2 px-4 rounded-md border border-border-darkLight'>
      <div className="my-3 font-semibold">Theme</div>
      <div className="flex flex-row">
        {themeOptions.map(theme =>
          <button
            className="px-5 py-3 text-left font-medium border border-border-darkLight hover:bg-border-darkLight"
            onClick={handleLanguageChange}
            value={theme.value}
            key={theme.value}
          >
            {theme.label}
          </button>
        )}
      </div>
      <div className="my-3 font-semibold">Language</div>
      <div className="flex flex-col h-40 overflow-y-auto">
        {languageOptions.map(language =>
          <button
            className="px-4 py-2 text-left font-medium hover:bg-border-darkLight"
            onClick={handleLanguageChange}
            value={language.value}
            key={language.value}
          >
            {language.label}
          </button>
        )}
      </div>
      <footer className="border-t border-width-full border-border-darkLight mt-2">
        <div className="flex my-4">
          <div className="px-4 py-4 border border-border-darkLight">
            <VscGithubInverted />
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
    </div>
  )
}

export default SettingsPopover
