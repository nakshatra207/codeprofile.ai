import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeetCodeProfile } from "@/components/LeetCodeProfile";
import { useLeetCodeStats } from "@/hooks/useLeetCodeStats";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertCircle, Save, CheckCircle2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const { stats, loading, error, fetchStats } = useLeetCodeStats();
  const { saveProfile, loading: savingProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 50) {
      return; // Validate username length
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return; // Only allow alphanumeric, underscore, hyphen
    }
    await fetchStats(trimmed);
  };

  const handleSaveProfile = async () => {
    if (!stats || !user) {
      toast({
        title: "Error",
        description: "Please sign in to save your profile",
        variant: "destructive",
      });
      return;
    }

    const profile = await saveProfile(username.trim(), stats);
    if (profile) {
      toast({
        title: "Profile saved!",
        description: "Your profile has been saved successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Profile Dashboard</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter your LeetCode username to generate your job-ready profile
            </p>
            
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Enter LeetCode username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/50 border-white/10 focus:border-cyan/50"
              />
              <Button 
                type="submit" 
                disabled={loading || !username.trim()}
                className="bg-gradient-to-r from-cyan to-blue hover:opacity-90"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>

          {/* Error State */}
          {error && (
            <div className="glass-card p-6 rounded-2xl mb-8 border border-red-500/30 bg-red-500/10">
              <div className="flex items-center gap-3 text-red-400 mb-3">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
              {error.includes("Database") && (
                <div className="text-sm text-red-300 ml-8 space-y-2">
                  <p>To fix this:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Read <code className="bg-black/30 px-2 py-1 rounded">DATABASE_SETUP.md</code></li>
                    <li>Run the SQL schema in Supabase SQL Editor</li>
                    <li>Refresh the page</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-cyan mx-auto mb-4" />
              <p className="text-muted-foreground">Fetching your LeetCode stats...</p>
            </div>
          )}

          {/* Profile Display */}
          {stats && !loading && (
            <div className="space-y-6">
              {/* Save Profile Button */}
              {user && (
                <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Save this profile to access it later
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="bg-gradient-to-r from-cyan to-blue hover:opacity-90"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {!user && (
                <div className="glass-card p-4 rounded-xl border border-cyan/30 bg-cyan/5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      <Link to="/signup" className="text-cyan hover:underline font-medium">
                        Sign up
                      </Link>
                      {" "}or{" "}
                      <Link to="/login" className="text-cyan hover:underline font-medium">
                        sign in
                      </Link>
                      {" "}to save and share your profile
                    </p>
                  </div>
                </div>
              )}

              <LeetCodeProfile stats={stats} />
            </div>
          )}

          {/* Empty State */}
          {!stats && !loading && !error && (
            <div className="text-center py-16">
              <div className="glass-card p-12 rounded-2xl max-w-lg mx-auto">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Search for a Profile
                </h3>
                <p className="text-muted-foreground">
                  Enter a LeetCode username above to see their coding profile and interview readiness score.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
