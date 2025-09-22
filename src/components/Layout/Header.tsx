import React from "react";
import LanguageSelector from "../Common/LanguageSelector";

interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white border-b border-suva-grey-25 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-suva-orange-100">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-suva-grey-75">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {children}
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default Header;
