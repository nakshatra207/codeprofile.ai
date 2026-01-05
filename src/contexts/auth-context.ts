import { createContext } from "react";
import type { AuthContextType } from "./auth-context.types";
import { defaultAuthContextValue } from "./auth-context.constants";

export const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);
