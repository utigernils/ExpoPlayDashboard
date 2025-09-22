import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, AuthState } from "../types";
import { authApi, userApi } from "../services/api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAdmin: () => boolean;
  checkAuth: () => Promise<void>;
  authState: AuthState;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const checkAuth = async () => {
    try {
      const response = await authApi.checkAuth();
      if (response.state) {
        setAuthState({
          isAuthenticated: true,
          user: response.user || null,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);
      if (response.user) {
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const checkAdmin = async (): Promise<boolean> => {
    const response = await userApi.getById(authState.user || "");

    return response.isAdmin === 1;
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAdmin,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
