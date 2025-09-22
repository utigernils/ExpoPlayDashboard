import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const languages = [
  { code: "en", name: "English", flag: "EN" },
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "it", name: "Italiano", flag: "IT" },
];

const LanguageSelector: React.FC = () => {
  const { changeLanguage, currentLanguage, t } = useTranslation();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2  -md text-gray-700 hover:bg-gray-100 transition-colors">
        <Globe size={18} />
        <span className="text-sm font-medium">{t("language")}</span>
        <span className="text-lg">
          {languages.find((lang) => lang.code === currentLanguage)?.flag ||
            "🌐"}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200  -md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={` w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-3 ${
                currentLanguage === language.code
                  ? "bg-suva-blue-75 text-gray-800"
                  : "text-gray-700"
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
