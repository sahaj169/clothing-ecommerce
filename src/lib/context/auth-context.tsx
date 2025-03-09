"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  serverInitialized: boolean;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  serverInitialized: false,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
  initialAuth?: {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
  };
}

export function AuthProvider({ children, initialAuth }: AuthProviderProps) {
  // Initialize state with server-provided values if available
  const [serverInitialized] = useState(!!initialAuth);
  const [user, setUser] = useState<User | null>(initialAuth?.user || null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuth?.isAuthenticated || false
  );
  const [isAdmin, setIsAdmin] = useState(initialAuth?.isAdmin || false);
  const [isLoading, setIsLoading] = useState(!initialAuth);

  // Use session to keep auth state in sync on client side
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    // Only update from client session if we didn't get server initialization
    // or if the session has changed
    if (!serverInitialized || session?.user?.id !== user?.id) {
      setUser((session?.user as User) || null);
      setIsAuthenticated(!!session?.user);
      setIsAdmin(session?.user?.role === "ADMIN");
      setIsLoading(false);
    }
  }, [session, status, serverInitialized, user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        serverInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
