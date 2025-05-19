import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { UserType } from "../helper/types";

type AuthContextType = {
  login: (token: string, user: UserType) => void;
  logout: () => void;
  isAuthenticated: boolean;
  requireAuth: () => boolean;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  user: UserType | null;
  updateUser: (updatedData: Partial<UserType>) => void; // 🆕 Added this
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // mark loading complete
  }, []);

  const login = (token: string, user: UserType) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
    setIsModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return false;
    }
    return true;
  };

  const updateUser = (updatedData: Partial<UserType>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        requireAuth,
        isModalOpen,
        setIsModalOpen,
        user,
        updateUser, // 🆕 Include it here
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
