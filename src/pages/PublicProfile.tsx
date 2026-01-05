import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProfile, Profile } from "@/hooks/useProfile";
import { LeetCodeProfile } from "@/components/LeetCodeProfile";
import { Loader2, AlertCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function PublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { getProfileBySlug, loading } = useProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadProfile = useCallback(async () => {
    if (!slug) return;

    try {
      const profileData = await getProfileBySlug(slug);
      if (profileData) {
        setProfile(profileData);
        setError(null);
      } else {
        setError("Profile not found or is not public");
      }
    } catch (err) {
      setError("Failed to load profile. It may not exist or be private.");
      setProfile(null);
    }
  }, [slug, getProfileBySlug]);

  useEffect(() => {
    if (slug) {
      loadProfile();
    }
  }, [slug, loadProfile]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Profile link copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Profile not found"}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Share Button */}
          <div className="mb-6 flex justify-end">
            <Button
              variant="outline"
              onClick={handleShare}
              className="bg-secondary/50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>

          {/* Profile Display */}
          <LeetCodeProfile stats={profile.profile_data} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

