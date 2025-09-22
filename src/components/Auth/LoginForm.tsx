import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import LanguageSelector from "../Common/LanguageSelector";
import ExpoPlayLogo from "../../ExpoPlay_Logo.png";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-suva-bg-grey flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex h-20 mt-3 shrink-0 items-center px-6">
            <div className="flex items-center">
              <img
                src={ExpoPlayLogo}
                alt="ExpoPlay Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-suva-grey-75">
          {t("checkingAuthentication")}
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError(t("invalidEmailOrPassword"));
        setLoading(false);
        notify({
          title: t("loginFailed"),
          description: t("invalidEmailOrPassword"),
          state: "error",
        });
        return;
      }

      notify({
        title: t("loginSuccessful"),
        description: t("welcomeBack"),
        state: "success",
      });
      navigate("/");
    } catch (err) {
      setError(t("errorOccurredDuringLogin"));
      notify({
        title: t("error"),
        description: t("errorOccurredDuringLogin"),
        state: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-suva-bg-grey flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-0 right-0 p-4">
        <LanguageSelector />
      </div>
      <div className="absolute top-0 left-0 p-2">
        <div className="flex h-20 mt-2 shrink-0 items-center px-6">
          <div className="flex items-center">
            <img
              src={ExpoPlayLogo}
              alt="ExpoPlay Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-suva-orange-100">
          {t("signInToExpoPlay")}
        </h2>
        <p className="mt-2 text-center text-sm text-suva-grey-75">
          {t("enterCredentialsToAccessDashboard")}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg    sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-suva-red-accent/10 border border-suva-red-accent/20 text-error px-4 py-3    text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-suva-grey-100"
              >
                {t("emailAddress")}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full   border border-suva-grey-25 px-3 py-2 placeholder-suva-grey-50 shadow-lg focus:border-suva-blue-100 focus:outline-none focus:ring-suva-blue-100 sm:text-sm"
                  placeholder={t("enterYourEmail")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-suva-grey-100"
              >
                {t("password")}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full    border border-suva-grey-25 px-3 py-2 placeholder-suva-grey-50 shadow-lg focus:border-suva-blue-100 focus:outline-none focus:ring-suva-blue-100 sm:text-sm"
                  placeholder={t("enterYourPassword")}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-full bg-suva-blue-100 py-2 px-3 text-sm font-semibold text-white shadow-lg hover:bg-suva-interaction-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-suva-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? t("signingIn") : t("signIn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
