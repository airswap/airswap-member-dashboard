import { create } from "zustand";
import { persist } from "zustand/middleware";

export const themeValues = ["system", "light", "dark"] as const;
export type ThemeValue = (typeof themeValues)[number];

export const themeLabels: Record<ThemeValue, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

export type ThemeState = {
  theme: ThemeValue;
  themeLastSet: number | null;
  setTheme: (newTheme: ThemeValue) => void;
};

const colorSchemeQuery = "(prefers-color-scheme: dark)";
const userSavedTheme = localStorage.getItem("theme");

const getCurrentSystemTheme = (): ThemeValue => {
  if (userSavedTheme && themeValues.includes(userSavedTheme as ThemeValue))
    return userSavedTheme as ThemeValue;

  return window.matchMedia(colorSchemeQuery).matches ? "dark" : "light";
};
const currentSystemTheme = getCurrentSystemTheme();
console.log(typeof currentSystemTheme);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: currentSystemTheme,
      themeLastSet: null,
      setTheme: (newTheme) =>
        set({
          theme: newTheme,
          themeLastSet: newTheme !== "system" ? Date.now() : null,
        }),
    }),
    {
      name: "theme",
    },
  ),
);

export const useCurrentTheme = () => {
  const [theme, themeLastSet] = useThemeStore((s) => [s.theme, s.themeLastSet]);
  const themeIsStale = themeLastSet && Date.now() - themeLastSet > 86_400_000;

  return theme === "system" || themeIsStale ? getCurrentSystemTheme() : theme;
};
