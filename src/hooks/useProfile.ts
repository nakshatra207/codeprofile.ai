import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LeetCodeStats } from "./useLeetCodeStats";
import { parseSupabaseError } from "@/utils/supabaseErrors";

export interface Profile {
  id: string;
  user_id: string;
  leetcode_username: string;
  profile_data: LeetCodeStats;
  share_slug: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  last_synced_at: string | null;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = async (
    leetcodeUsername: string,
    stats: LeetCodeStats
  ): Promise<Profile | null> => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Generate a share slug if it doesn't exist
      const shareSlug = generateSlug();

      // Check if profile already exists for this user and username
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("leetcode_username", leetcodeUsername)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      let profileData;

      if (existingProfile) {
        // Update existing profile
        const { data, error: updateError } = await supabase
          .from("profiles")
          .update({
            profile_data: JSON.parse(JSON.stringify(stats)),
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", existingProfile.id)
          .select()
          .single();

        if (updateError) throw updateError;
        profileData = data;
      } else {
        // Insert new profile
        const { data, error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            leetcode_username: leetcodeUsername,
            profile_data: JSON.parse(JSON.stringify(stats)),
            share_slug: shareSlug,
            is_public: false,
            last_synced_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;
        profileData = data;
      }

      setLoading(false);
      return profileData;
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      let message = errorInfo.message;
      
      // Additional context for database setup issues
      if (message.includes("table") || message.includes("not found")) {
        message = "Database not initialized. Please ensure you've set up your Supabase database.";
      }
      
      console.error('Error saving profile:', err);
      setError(message);
      setLoading(false);
      return null;
    }
  };

  const getUserProfiles = async (): Promise<Profile[]> => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (fetchError) throw fetchError;

      setLoading(false);
      return data || [];
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      console.error('Error fetching profiles:', err);
      setError(errorInfo.message);
      setLoading(false);
      return [];
    }
  };

  const getProfileBySlug = async (slug: string): Promise<Profile | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("share_slug", slug)
        .eq("is_public", true)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) {
        throw new Error("Profile not found");
      }

      setLoading(false);
      return data as Profile;
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      console.error('Error fetching profile:', err);
      setError(errorInfo.message);
      setLoading(false);
      return null;
    }
  };

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (deleteError) throw deleteError;

      setLoading(false);
      return true;
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      console.error('Error deleting profile:', err);
      setError(errorInfo.message);
      setLoading(false);
      return false;
    }
  };

  const toggleProfileVisibility = async (
    profileId: string,
    isPublic: boolean
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_public: isPublic })
        .eq("id", profileId);

      if (updateError) throw updateError;

      setLoading(false);
      return true;
    } catch (err) {
      const errorInfo = parseSupabaseError(err);
      console.error('Error updating profile visibility:', err);
      setError(errorInfo.message);
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    error,
    saveProfile,
    getUserProfiles,
    getProfileBySlug,
    deleteProfile,
    toggleProfileVisibility,
  };
}

// Generate a random slug with timestamp to reduce collision risk
function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const timestamp = Date.now().toString(36).slice(-6);
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return timestamp + random; // e.g., "z1a2b3x4y5z6" (12 chars, unique per ms)
}

