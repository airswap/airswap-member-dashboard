import create from "zustand";
import { persist } from "zustand/middleware";

export const languageQuery = "preferred-language"

export type LanguageState = {
  language: string;
  setLanguage: (newLanguage: string) => void;
}

const getUserPreferredLanguage = () =>
  navigator.language.split('-')[0] || 'en';

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: getUserPreferredLanguage(),
      setLanguage: (newLanguage) =>
        set({
          language: newLanguage,
        }),
    }),
    {
      name: "language-setting"
    }
  )
);

export const useCurrentLanguage = () => {
  const [language] = useLanguageStore((s) => [s.language]);
  return language
}
