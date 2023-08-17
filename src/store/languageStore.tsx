import { create } from "zustand";
import { persist } from "zustand/middleware";

export const languageQuery = "preferred-language";

export const languageValues = [
  "us",
  "fr",
  "no",
  "nl",
  "pt",
  "tr",
  "ro",
  "ru",
  "cn",
] as const;
export type LanguageValue = (typeof languageValues)[number];

export const languageLabels: Record<LanguageValue, string> = {
  us: "English",
  fr: "Français",
  no: "Norsk Bokmål",
  nl: "Nederlands",
  pt: "Portugues",
  tr: "Türkçe",
  ro: "Limba română",
  ru: "українська",
  cn: "中文繁體",
};

export type LanguageState = {
  language: string;
  setLanguage: (newLanguage: string) => void;
};

const getUserPreferredLanguage = () => navigator.language.split("-")[0] || "EN";

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
      name: "language",
    },
  ),
);
