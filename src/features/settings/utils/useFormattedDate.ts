export const useFormattedDate = (date: string | undefined) => {
  if (typeof date === "string") {
    const localeDate = new Date(date).toLocaleDateString();
    return localeDate.replace(/\//g, "-");
  } else {
    return undefined;
  }
};
