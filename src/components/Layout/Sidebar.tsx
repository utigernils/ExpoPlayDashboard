import React from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { NavLink } from "react-router-dom";
import api from "../../services/api";
import {
  Home,
  Monitor,
  Calendar,
  Users,
  FileText,
  User,
  GamepadIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ExpoPlayLogo from "../../ExpoPlay_Logo.png";

const Sidebar: React.FC = () => {
  const { logout, checkAdmin, loading, checkAuth, user } = useAuth();
  const { t } = useTranslation();

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/login");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [checkAuth]);

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
    { name: t("consoles"), href: "/consoles", icon: Monitor },
    { name: t("expos"), href: "/expos", icon: Calendar },
    { name: t("players"), href: "/players", icon: Users },
    { name: t("quizzes"), href: "/quizzes", icon: FileText },
    { name: t("playedQuizzes"), href: "/played-quizzes", icon: GamepadIcon },
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
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8  rounded-full bg-suva-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {userData?.firstName?.charAt(0) || "X"}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-suva-grey-100 truncate">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-sm text-suva-grey-75 truncate">
                  {userData?.email}
                </p>
              </div>
            </div>
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
