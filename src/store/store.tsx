import { create } from 'zustand'

interface SettingsState {
  selectedTheme: string,
  selectedLanguage: string,
  setTheme: (theme: string) => void
  setLanguage: (language: string) => void
}

const useSettingsStore = create<SettingsState>((set) => ({
  selectedTheme: 'dark',
  setTheme: (selectedTheme) => set({ selectedTheme }),

  selectedLanguage: 'english',
  setLanguage: (selectedLanguage) => set({ selectedLanguage }),
}))

export default useSettingsStore
