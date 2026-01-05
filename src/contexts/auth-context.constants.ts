import type { AuthContextType } from "./auth-context.types";

export const defaultAuthContextValue: AuthContextType = {
  user: null,
  session: null,
  userProfile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshUserProfile: async () => {},
};
