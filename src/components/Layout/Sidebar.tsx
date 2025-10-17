import React from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { NavLink } from "react-router-dom";
import {
  Home,
  Monitor,
  Calendar,
  Users,
  FileText,
  User,
  GamepadIcon,
  LogOut,
  FileQuestion,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ExpoPlayLogo from "../../ExpoPlay_Logo.png";
import { saveAs } from "file-saver";

const downloadDocumentation = () => {
  const pdfUrl = "https://expoplay.ch/documentation.pdf";
  const fileName = "ExpoPlay_Dashboard_Dokumentation.pdf";
  saveAs(pdfUrl, fileName);
};

const Sidebar: React.FC = () => {
  const { logout, checkAdmin, loading, user } = useAuth();
  const { t } = useTranslation();

  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const check = async () => {
      if (!loading && user) {
        const result = await checkAdmin();
        setIsAdmin(result);
      }
    };
    check();
  }, [checkAdmin, loading, user]);

  const navigation = [
    { name: t("dashboard"), href: "/", icon: Home },
    { name: t("quizzes"), href: "/quizzes", icon: FileText },
    { name: t("expos"), href: "/expos", icon: Calendar },
    { name: t("players"), href: "/players", icon: Users },
    { name: t("playedQuizzes"), href: "/played-quizzes", icon: GamepadIcon },
    { name: t("consoles"), href: "/consoles", icon: Monitor },
    ...(isAdmin ? [{ name: t("users"), href: "/users", icon: User }] : []),
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-suva-grey-25">
      {/* Logo */}
      <div className="flex h-20 mt-3 shrink-0 items-center px-6">
        <div className="flex items-center">
          <img
            src={ExpoPlayLogo}
            alt="ExpoPlay Logo"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-4">
        <ul className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex gap-x-3    p-3 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-suva-orange-100"
                      : "text-suva-grey-100 hover:bg-suva-bg-grey hover:text-suva-grey-100"
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-4 py-4 w-full flex items-center gap-2">
        <p className="text-suva-grey-25">Build 1.5.2</p>
        <button
          onClick={downloadDocumentation}
          className="p-1 rounded hover:bg-suva-bg-grey text-suva-grey-25"
        >
          <FileQuestion className="h-4 w-4" />
        </button>
      </div>
      <div className="border-t border-suva-grey-25 p-2">
        {loading ? (
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-suva-grey-25 animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-suva-grey-25   animate-pulse mb-1"></div>
              <div className="h-3 bg-suva-grey-50   animate-pulse"></div>
            </div>
          </div>
        ) : user ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center space-x-3 mb-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive ? "bg-suva-bg-grey" : "hover:bg-suva-bg-grey"
                }`
              }
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8  rounded-full bg-suva-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "X"}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-suva-grey-100 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-suva-grey-75 truncate">
                  {user.email}
                </p>
              </div>
            </NavLink>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-suva-grey-100 hover:bg-suva-bg-grey hover:text-suva-grey-100    transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("logout")}</span>
            </button>
          </>
        ) : (
          <div className="text-sm text-suva-grey-75">Not signed in</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
