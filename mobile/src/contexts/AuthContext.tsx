import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { httpClient } from "../services/httpClient";

import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  email: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
};

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  goal: string;
  gender: string;
  birthDate: string;
  activityLevel: number;
  height: number;
  weight: number;
  account: {
    name: string;
    email: string;
    password: string;
  };
};

export async function signIn({ email, password }: SignInParams) {}

interface IAuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn(params: SignInParams): Promise<void>;
  signUp(params: SignUpParams): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext({} as IAuthContextValue);

const TOKEN_STORAGE_KEY = "@foodiary:token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  useEffect(() => {
    async function run() {
      if (!token) {
        httpClient.defaults.headers.common["Authorization"] = null;
        return;
      }
      httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    run();
  }, [token]);

  useEffect(() => {
    async function load() {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      setToken(token);
      setIsLoadingToken(false);
    }
    load();
  }, []);

  const { mutateAsync: signIn } = useMutation({
    mutationFn: async (params: SignInParams) => {
      const { data } = await httpClient.post("/signin", params);

      setToken(data.accessToken);
    },
  });

  const { mutateAsync: signUp } = useMutation({
    mutationFn: async (params: SignUpParams) => {
      const { data } = await httpClient.post("/signup", params);

      setToken(data.accessToken);
    },
  });

  const signOut = useCallback(async () => {
    setToken(null);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const { data: user } = useQuery({
    enabled: !!token,
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await httpClient.get<{ user: User }>("/me");
      const { user } = data;

      return user;
    },
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        isLoading: isLoadingToken,
        signIn,
        signUp,
        signOut,
        user: user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
