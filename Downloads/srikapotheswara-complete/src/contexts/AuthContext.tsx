import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { trpc } from '@/providers/trpc';

interface AdminUser {
  id: number;
  email: string;
  fullName: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState<AdminUser | null>(null);

  const { data: meData, isLoading } = trpc.auth.me.useQuery(
    token ? { token } : undefined,
    { enabled: !!token, retry: false }
  );

  useEffect(() => {
    if (meData) {
      setUser(meData);
    } else if (!isLoading) {
      setUser(null);
    }
  }, [meData, isLoading]);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
      setUser(data.user);
    },
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch {
      return false;
    }
  }, [loginMutation]);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
    window.location.reload();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
