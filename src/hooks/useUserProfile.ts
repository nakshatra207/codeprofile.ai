import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { parseSupabaseError } from "@/utils/supabaseErrors";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create or update user profile
  const createProfile = async (
    userId: string,
    fullName: string,
    email: string,
    avatarUrl?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          full_name: fullName,
          email: email,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      setError(errorInfo.message);
      console.error('Error creating profile:', err);
      return { success: false, error: errorInfo.message };
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const getProfile = async (userId: string): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data as UserProfile || null;
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      setError(errorInfo.message);
      console.error('Error fetching profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (
    userId: string,
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url'>>
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      setError(errorInfo.message);
      console.error('Error updating profile:', err);
      return { success: false, error: errorInfo.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createProfile,
    getProfile,
    updateProfile,
    loading,
    error,
  };
}
