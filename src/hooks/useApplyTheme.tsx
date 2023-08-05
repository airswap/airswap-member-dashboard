import { useEffect } from "react";
import { useCurrentTheme } from "../store/themeStore";

export const useApplyTheme = () => {
  const theme = useCurrentTheme()

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
}
