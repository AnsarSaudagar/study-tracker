import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authService from '@/services/authService';
import type {
  AuthResult,
  LoginInput,
  SignupInput,
  User,
} from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True until the initial session restore from LocalStorage completes. */
  isInitializing: boolean;
  login: (input: LoginInput) => Promise<AuthResult>;
  signup: (input: SignupInput) => Promise<AuthResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore any existing session on mount (session persistence after refresh).
  useEffect(() => {
    setUser(authService.getCurrentUser());
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<AuthResult> => {
    const result = await authService.login(input);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const signup = useCallback(
    async (input: SignupInput): Promise<AuthResult> => {
      const result = await authService.signup(input);
      if (result.ok) setUser(result.user);
      return result;
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      login,
      signup,
      logout,
    }),
    [user, isInitializing, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
