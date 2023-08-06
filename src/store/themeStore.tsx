import { create } from "zustand";
import { persist } from "zustand/middleware";

export const colorSchemeQuery = "(prefers-color-scheme: dark)";

export const themeValues = ['system', 'light', 'dark'] as const
export type ThemeValue = typeof themeValues[number]

export const themeLabels: Record<ThemeValue, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark"
}

export type ThemeState = {
  theme: ThemeValue;
  themeLastSet: number | null;
  setTheme: (newTheme: ThemeValue) => void;
}

const getCurrentSystemTheme = () =>
  window.matchMedia(colorSchemeQuery).matches ? "dark" : "light";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      themeLastSet: null,
      setTheme: (newTheme) =>
        set({
          theme: newTheme,
          themeLastSet: newTheme !== "system" ? Date.now() : null,
        }),
    }),
    {
      name: "theme"
    }
  )
);

export const useCurrentTheme = () => {
  const [theme, themeLastSet] = useThemeStore((s) => [s.theme, s.themeLastSet]);
  const themeIsStale = themeLastSet && Date.now() - themeLastSet > 86_400_000;
  return theme === "system" || themeIsStale ? getCurrentSystemTheme() : theme;
}
