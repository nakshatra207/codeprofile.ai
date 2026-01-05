import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  Camera, 
  Save,
  ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSettings() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { updateProfile, loading } = useUserProfile();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (userProfile) {
      setFullName(userProfile.full_name || "");
      setAvatarUrl(userProfile.avatar_url || "");
    }
  }, [user, userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) return;

    const { success, error } = await updateProfile(user.id, {
      full_name: fullName.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    });

    if (success) {
      setSuccess(true);
      await refreshUserProfile();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(error || "Failed to update profile");
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Overview Card */}
          <Card className="glass-card bg-card/50 border-border/50 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userProfile.avatar_url || ""} />
                  <AvatarFallback className="bg-cyan/20 text-cyan text-lg">
                    {userProfile.full_name 
                      ? userProfile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                      : user.email?.charAt(0).toUpperCase()
                    }
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {userProfile.full_name || "No name set"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Member since {new Date(userProfile.created_at).toLocaleDateString()}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-cyan/10 border-cyan/30 text-cyan">
                      Verified User
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card className="glass-card bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green/50 bg-green/10">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  <AlertDescription className="text-green">
                    Profile updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className="bg-secondary/50 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be displayed on your public profiles
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-secondary/50 border-white/10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="avatarUrl"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      disabled={loading}
                      className="bg-secondary/50 border-white/10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optional: Add a profile picture URL
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan to-blue hover:opacity-90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFullName(userProfile.full_name || "");
                      setAvatarUrl(userProfile.avatar_url || "");
                    }}
                    disabled={loading}
                    className="bg-secondary/50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="glass-card bg-card/50 border-border/50 mt-6">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan">0</p>
                  <p className="text-xs text-muted-foreground">Profiles Created</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green">0</p>
                  <p className="text-xs text-muted-foreground">Public Profiles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue">0</p>
                  <p className="text-xs text-muted-foreground">Profile Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple">0</p>
                  <p className="text-xs text-muted-foreground">Resume Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
