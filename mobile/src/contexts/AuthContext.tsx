import { createContext, ReactNode } from "react";

interface IAuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ isLoggedIn: false, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
