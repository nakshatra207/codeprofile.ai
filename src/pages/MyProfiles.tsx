import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProfile, Profile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Globe, 
  Lock,
  Calendar,
  User as UserIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { LeetCodeProfile } from "@/components/LeetCodeProfile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyProfiles() {
  const { user, loading: authLoading } = useAuth();
  const { getUserProfiles, deleteProfile, toggleProfileVisibility, loading } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadProfiles = useCallback(async () => {
    const userProfiles = await getUserProfiles();
    setProfiles(userProfiles);
  }, [getUserProfiles]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    loadProfiles();
  }, [user, authLoading, navigate, loadProfiles]);

  const handleDelete = async (profileId: string) => {
    setProfileToDelete(profileId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;

    const success = await deleteProfile(profileToDelete);
    if (success) {
      toast({
        title: "Profile deleted",
        description: "Your profile has been deleted successfully.",
      });
      setProfiles(profiles.filter((p) => p.id !== profileToDelete));
      if (selectedProfile?.id === profileToDelete) {
        setSelectedProfile(null);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to delete profile. Please try again.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setProfileToDelete(null);
  };

  const handleToggleVisibility = async (profile: Profile) => {
    const success = await toggleProfileVisibility(profile.id, !profile.is_public);
    if (success) {
      toast({
        title: profile.is_public ? "Profile made private" : "Profile made public",
        description: profile.is_public
          ? "Your profile is now private."
          : "Your profile is now publicly accessible.",
      });
      setProfiles(
        profiles.map((p) =>
          p.id === profile.id ? { ...p, is_public: !p.is_public } : p
        )
      );
      if (selectedProfile?.id === profile.id) {
        setSelectedProfile({ ...selectedProfile, is_public: !selectedProfile.is_public });
      }
    }
  };

  const copyShareLink = (slug: string) => {
    const url = `${window.location.origin}/u/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share link copied to clipboard.",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-gradient">My Profiles</span>
              </h1>
              <p className="text-muted-foreground">
                Manage your saved LeetCode profiles
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/dashboard">Create New Profile</Link>
            </Button>
          </div>

          {profiles.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center">
              <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No profiles yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first profile to get started
              </p>
              <Button variant="hero" asChild>
                <Link to="/dashboard">Create Profile</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profiles List */}
              <div className="lg:col-span-1 space-y-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${
                      selectedProfile?.id === profile.id
                        ? "ring-2 ring-cyan border-cyan"
                        : "hover:border-cyan/50"
                    }`}
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {profile.leetcode_username}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={profile.is_public ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {profile.is_public ? (
                          <Globe className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {profile.is_public ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(profile);
                        }}
                        className="h-7 text-xs"
                      >
                        {profile.is_public ? <Lock className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
                        {profile.is_public ? "Make Private" : "Make Public"}
                      </Button>
                      {profile.is_public && profile.share_slug && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyShareLink(profile.share_slug!);
                          }}
                          className="h-7 text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Link
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(profile.id);
                        }}
                        className="h-7 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                {selectedProfile ? (
                  <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {selectedProfile.leetcode_username}
                          </h2>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Created: {new Date(selectedProfile.created_at).toLocaleDateString()}
                            </div>
                            {selectedProfile.last_synced_at && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Synced: {new Date(selectedProfile.last_synced_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedProfile.is_public && selectedProfile.share_slug && (
                          <Button
                            variant="outline"
                            onClick={() => copyShareLink(selectedProfile.share_slug!)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Share Link
                          </Button>
                        )}
                      </div>
                    </div>

                    <LeetCodeProfile stats={selectedProfile.profile_data} />
                  </div>
                ) : (
                  <div className="glass-card p-12 rounded-2xl text-center">
                    <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Select a profile
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a profile from the list to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

