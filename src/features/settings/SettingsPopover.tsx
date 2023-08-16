import { Dispatch, FC, RefObject } from "react";
import { useClickOutside } from "@react-hookz/web";
import { VscGithubInverted } from "react-icons/vsc";
import { TextWithLineAfter } from "../common/TextWithLineAfter";
import {
  ThemeValue,
  themeLabels,
  themeValues,
  useThemeStore,
} from "../../store/themeStore";
import {
  LanguageValue,
  languageLabels,
  languageValues,
  useLanguageStore,
} from "../../store/languageStore";
import { twJoin } from "tailwind-merge";

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

  useClickOutside(settingsPopoverRef, () => togglePopover(false), [
    "click",
    "keydown",
  ]);

  return (
    <div
      className={twJoin([
        "text-font-darkSubtext absolute top-20 rounded-md border border-border-lightLightGray bg-bg-lightSecondary px-4 py-2 text-sm font-medium",
        "sm: right - 60",
        "dark:border-border-darkGray dark:bg-bg-darkShaded",
      ])}
      ref={settingsPopoverRef}
    >
      <TextWithLineAfter className="mt-1">THEME</TextWithLineAfter>
      <div className="flex flex-row">
        {themeValues.map((themeValue: ThemeValue) => {
          const isSelected = themeValue === theme;
          return (
            <button
              className={twJoin(
                [
                  "w-1/3 border px-4 py-2 text-center font-normal",
                  "dark:border-border-darkGray",
                  "dark:hover:border-border-darkLight",
                  "hover:border-border-darkLight",
                ],
                isSelected
                  ? [
                      "bg-bg-lightGray",
                      "dark:bg-border-darkGray",
                      "dark:text-font-darkPrimary",
                      "text-font-lightBluePrimary",
                      "font-semibold",
                    ]
                  : [],
              )}
              onClick={() => handleThemeChange(themeValue)}
              value={themeValue}
              key={themeValue}
            >
              {themeLabels[themeValue]}
            </button>
          );
        })}
      </div>
      <TextWithLineAfter>LANGUAGE</TextWithLineAfter>
      <div className="mb-3 flex h-40 flex-col overflow-auto">
        {languageValues.map((languageValue) => {
          const isSelected = languageValue === language;
          return (
            <button
              className={twJoin(
                [
                  "px-4 py-2 text-left font-normal",
                  "hover:text-font-lightBluePrimary",
                  "dark:hover:text-font-darkPrimary",
                ],
                isSelected
                  ? [
                      "text-font-lightBluePrimary bg-bg-lightGray font-semibold",
                      "dark:text-font-darkPrimary dark:bg-border-darkGray",
                    ]
                  : [],
              )}
              onClick={() => handleLanguageChange(languageValue)}
              value={languageValue}
              key={languageValue}
            >
              {languageLabels[languageValue]}
            </button>
          );
        })}
      </div>
      <hr
        className={twJoin(
          ["border-t-1 absolute left-0 my-2 w-full"],
          ["dark:border-border-darkGray"],
        )}
      />
      <footer className="border-width-full flex content-center text-xs">
        <div className="my-4 flex items-center">
          <a
            href="https://github.com/airswap/airswap-voter-rewards"
            target="_"
            className={twJoin([
              "border px-4 py-3",
              "dark:border-border-darkGray",
              "hover:border-border-darkLight",
            ])}
          >
            <div>
              <VscGithubInverted
                color={theme === "dark" ? "white" : "black"}
                size="16"
              />
            </div>
          </a>

          <a
            href="#"
            target="_"
            className={twJoin([
              "border-b border-t px-4 py-3",
              "dark:border-border-darkGray",
              "hover:border-border-darkLight",
            ])}
          >
            <div>
              {/* TODO: replace with dynamic name of last commit */}
              2ac00c
            </div>
          </a>
          <a
            href="#"
            target="_"
            className={twJoin([
              "border px-4 py-3",
              "dark:border-border-darkGray",
              "hover:border-border-darkLight",
            ])}
          >
            <div>
              {/* {formattedCommitDate} */}
              2023-08-08
            </div>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default SettingsPopover;
