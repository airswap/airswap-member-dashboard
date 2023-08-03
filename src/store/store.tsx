import { create } from 'zustand'

interface SettingsState {
  theme: string,
  selectedLanguage: string,
  setTheme: (theme: string) => void
  setLanguage: (language: string) => void
}

const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  selectedLanguage: 'english',
  setLanguage: (selectedLanguage) => set({ selectedLanguage }),
}))

export default useSettingsStore
