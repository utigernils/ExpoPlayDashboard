import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
  try {
    const { t, i18n } = useI18nTranslation();

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
      localStorage.setItem("language", lng);
    };

    return {
      t,
      changeLanguage,
      currentLanguage: i18n.language,
    };
  } catch (error) {
    console.error("useTranslation hook error:", error);

    return {
      t: (key: string) => key,
      changeLanguage: () => {},
      currentLanguage: "de",
    };
  }
};
