import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

export const useApplyTheme = () => {
  const [theme] = useThemeStore((state) => [state.theme]);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
}
