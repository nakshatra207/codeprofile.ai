import { User, Session } from "@supabase/supabase-js";
import type { UserProfile } from "@/hooks/useUserProfile";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}
