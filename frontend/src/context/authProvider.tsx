import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState,
} from "react";

// Define types for auth state and context
interface AuthState {
  id?: string | null;
  email: string | null;
  username: string | null;
  accessToken: string | null;
  roles: number[];
}

const initialAuthState: AuthState = {
  id: null,
  email: null,
  username: null,
  accessToken: null,
  roles: [],
};

interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

  console.log(auth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
