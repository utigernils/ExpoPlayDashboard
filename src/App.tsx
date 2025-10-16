import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  NotificationProvider,
  useNotification,
} from "./context/NotificationContext";
import { setUnauthorizedCallback } from "./services/api/api";
import LoginForm from "./components/Auth/LoginForm";
import Dashboard from "./pages/Dashboard";
import Consoles from "./pages/Consoles";
import Expos from "./pages/Expos";
import Players from "./pages/Players";
import Quizzes from "./pages/Quizzes";
import Users from "./pages/Users";
import PlayedQuizzes from "./pages/PlayedQuizzes";
import Profile from "./pages/Profile";
import PlayerJoin from "./pages/PlayerJoin";
import "./i18n";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-suva-bg-grey flex items-center justify-center">
        <div className="animate-spin  rounded-full h-12 w-12 border-b-2 border-suva-blue-100"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { t } = useTranslation();

  useEffect(() => {
    setUnauthorizedCallback(() => {
      notify({
        title: t("sessionExpired"),
        description: t("sessionExpiredMessage"),
        state: "error",
      });
      navigate("/login", { replace: true });
    });
  }, [navigate, notify, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-suva-bg-grey flex items-center justify-center">
        <div className="animate-spin  rounded-full h-12 w-12 border-b-2 border-suva-blue-100"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/consoles" element={<Consoles />} />
      <Route path="/expos" element={<Expos />} />
      <Route path="/players" element={<Players />} />
      <Route path="/quizzes" element={<Quizzes />} />
      <Route path="/users" element={<Users />} />
      <Route path="/played-quizzes" element={<PlayedQuizzes />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-suva-bg-grey flex items-center justify-center">
          <div className="animate-spin  rounded-full h-12 w-12 border-b-2 border-suva-blue-100"></div>
        </div>
      }
    >
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/player-join" element={<PlayerJoin />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppRoutes />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </Suspense>
  );
};

export default App;
