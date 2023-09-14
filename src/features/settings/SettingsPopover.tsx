import { useClickOutside } from "@react-hookz/web";
import { Dispatch, FC, RefObject } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { twJoin } from "tailwind-merge";
import {
  LanguageValue,
  languageLabels,
  languageValues,
  useLanguageStore,
} from "../../store/languageStore";
import {
  ThemeValue,
  themeLabels,
  themeValues,
  useThemeStore,
} from "../../store/themeStore";
import { Button } from "../common/Button";
import { LineBreak } from "../common/LineBreak";
import { TextWithLineAfter } from "../common/TextWithLineAfter";
import { useFormattedDate } from "./utils/useFormattedDate";

interface SettingsPopoverProps {
  settingsPopoverRef: RefObject<HTMLDivElement>;
  togglePopover: Dispatch<boolean>;
}

const SettingsPopover: FC<SettingsPopoverProps> = ({
  settingsPopoverRef,
  togglePopover,
}) => {
  const { setTheme, theme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  const handleThemeChange = (newTheme: ThemeValue) => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: LanguageValue) => {
    setLanguage(newLanguage);
  };

  useClickOutside(settingsPopoverRef, () => togglePopover(false), ["click"]);
  const commitHash = process.env.COMMIT_HASH;
  const commitDate = process.env.COMMIT_DATE;

  const formattedDate = useFormattedDate(commitDate);

  return (
    <div
      className={twJoin([
        "absolute bg-gray-900 text-gray-400 top-20 z-50 rounded-md border border-gray-800 px-4 py-2 font-semibold",
        "sm:right-60",
      ])}
      ref={settingsPopoverRef}
    >
      <TextWithLineAfter className="mt-1">Theme</TextWithLineAfter>
      <div className="flex flex-row">
        {themeValues.map((themeValue: ThemeValue) => {
          const isSelected = themeValue === theme;
          return (
            <Button
              className={twJoin(
                "w-1/3 border px-4 py-2 text-center font-normal normal-case",
                isSelected && "bg-gray-800 text-white",
              )}
              rounded="none"
              onClick={() => handleThemeChange(themeValue)}
              value={themeValue}
              key={themeValue}
            >
              {themeLabels[themeValue]}
            </Button>
          );
        })}
      </div>
      <TextWithLineAfter>Language</TextWithLineAfter>
      <div className="mb-3 flex h-40 flex-col overflow-auto">
        {languageValues.map((languageValue) => {
          const isSelected = languageValue === language;
          return (
            <Button
              className={twJoin(
                "px-4 py-1.5 text-left font-normal normal-case",
                "border-gray-900 hover:border-1 hover:border-gray-400",
                isSelected && "bg-gray-800 text-white border-gray-800",
              )}
              rounded="none"
              onClick={() => handleLanguageChange(languageValue)}
              value={languageValue}
              key={languageValue}
            >
              {languageLabels[languageValue]}
            </Button>
          );
        })}
      </div>
      <LineBreak />
      <footer className="border-width-full flex content-center text-xs">
        <div className="my-4 flex items-center">
          <a
            href="https://github.com/airswap/airswap-voter-rewards"
            target="_"
            className="border border-gray-800 px-4 py-3"
          >
            <div>
              <VscGithubInverted color="white" size="16" />
            </div>
          </a>

          <a
            href={`https://github.com/airswap/airswap-voter-rewards/commit/${commitHash}`}
            target="_"
            className="border-t border-b border-gray-800 px-4 py-3"
          >
            <div>{commitHash?.slice(-6)}</div>
          </a>
          <a
            href={`https://github.com/airswap/airswap-voter-rewards/commit/${commitHash}`}
            target="_"
            className="border border-gray-800 px-4 py-3"
          >
            <div>{formattedDate}</div>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default SettingsPopover;
