import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Users, 
  TrendingUp, 
  Star, 
  Mail, 
  Download,
  BarChart3,
  Target,
  Zap,
  Award
} from "lucide-react";
import { useProfile, Profile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export default function RecruiterDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDSA, setFilterDSA] = useState<string>("all");
  const [filterConsistency, setFilterConsistency] = useState<string>("all");
  const [filterReadiness, setFilterReadiness] = useState<string>("all");
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockProfiles: Profile[] = [
      {
        id: "1",
        user_id: "user1",
        leetcode_username: "nakshatra",
        share_slug: "nakshatra",
        profile_data: {
          username: "nakshatra",
          profile: {
            realName: "Nakshatra Singh",
            ranking: 15420,
            reputation: 1250,
            starRating: 3,
            userAvatar: ""
          },
          submitStats: {
            acSubmissionNum: [
              { difficulty: "Easy", count: 350, submissions: 380 },
              { difficulty: "Medium", count: 280, submissions: 450 },
              { difficulty: "Hard", count: 95, submissions: 180 }
            ],
            totalSubmissionNum: []
          },
          problemsSolvedBeatsStats: [],
          streak: 45,
          badges: [],
          contestRating: 1850,
          contestRanking: 12450,
          contestAttended: 28,
          skillStats: {
            advanced: [
              { tagName: "Dynamic Programming", problemsSolved: 45 },
              { tagName: "Graph Theory", problemsSolved: 38 }
            ],
            intermediate: [
              { tagName: "Trees", problemsSolved: 52 },
              { tagName: "Arrays", problemsSolved: 68 }
            ],
            fundamental: [
              { tagName: "String", problemsSolved: 35 },
              { tagName: "Math", problemsSolved: 28 }
            ]
          }
        },
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString()
      },
      {
        id: "2",
        user_id: "user2",
        leetcode_username: "alice_coder",
        share_slug: "alice_coder",
        profile_data: {
          username: "alice_coder",
          profile: {
            realName: "Alice Chen",
            ranking: 8750,
            reputation: 2100,
            starRating: 4,
            userAvatar: ""
          },
          submitStats: {
            acSubmissionNum: [
              { difficulty: "Easy", count: 420, submissions: 440 },
              { difficulty: "Medium", count: 385, submissions: 420 },
              { difficulty: "Hard", count: 156, submissions: 200 }
            ],
            totalSubmissionNum: []
          },
          problemsSolvedBeatsStats: [],
          streak: 120,
          badges: [],
          contestRating: 2150,
          contestRanking: 5420,
          contestAttended: 45,
          skillStats: {
            advanced: [
              { tagName: "Dynamic Programming", problemsSolved: 68 },
              { tagName: "Graph Theory", problemsSolved: 52 }
            ],
            intermediate: [
              { tagName: "Trees", problemsSolved: 75 },
              { tagName: "Arrays", problemsSolved: 85 }
            ],
            fundamental: [
              { tagName: "String", problemsSolved: 48 },
              { tagName: "Math", problemsSolved: 42 }
            ]
          }
        },
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString()
      }
    ];
    
    setProfiles(mockProfiles);
    setFilteredProfiles(mockProfiles);
    setLoading(false);
  }, []);

  // Calculate scores for each profile (typed with null safety)
  const calculateScores = (profile: Profile["profile_data"] | null) => {
    if (!profile || !profile.submitStats || !profile.skillStats) {
      return { dsaStrength: 0, consistency: 0, interviewReadiness: 0 };
    }
    const easy = profile.submitStats.acSubmissionNum?.find((s) => s.difficulty === "Easy")?.count || 0;
    const medium = profile.submitStats.acSubmissionNum?.find((s) => s.difficulty === "Medium")?.count || 0;
    const hard = profile.submitStats.acSubmissionNum?.find((s) => s.difficulty === "Hard")?.count || 0;
    const total = easy + medium + hard;

    const problemScore = Math.min(100, (easy * 1 + medium * 2 + hard * 4) / 20);
    const allSkills = [
      ...profile.skillStats.advanced,
      ...profile.skillStats.intermediate,
      ...profile.skillStats.fundamental,
    ];
    const topicScore = Math.min(100, (allSkills.length * 5));
    const dsaStrength = Math.round((problemScore + topicScore) / 2);
    
    const streakScore = Math.min(100, profile.streak * 3);
    const contestBonus = profile.contestAttended > 0 ? Math.min(20, profile.contestAttended * 2) : 0;
    const consistency = Math.round(streakScore + contestBonus);
    
    const difficultyBalance = (hard * 4 + medium * 2 + easy * 1) / (total || 1);
    const contestPerformance = profile.contestRating > 0 ? Math.min(30, profile.contestRating / 30) : 0;
    const totalProblemsScore = Math.min(30, total / 20);
    const interviewReadiness = Math.round(
      (dsaStrength * 0.4 + consistency * 0.3 + difficultyBalance * 0.2 + contestPerformance + totalProblemsScore)
    );

    return { dsaStrength, consistency, interviewReadiness };
  };

  // Filter profiles based on criteria
  useEffect(() => {
    let filtered = profiles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((p) => 
        p.profile_data.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.profile_data.profile.realName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // DSA Strength filter
    if (filterDSA !== "all") {
      filtered = filtered.filter((p) => {
        const scores = calculateScores(p.profile_data);
        if (filterDSA === "high") return scores.dsaStrength >= 80;
        if (filterDSA === "medium") return scores.dsaStrength >= 60 && scores.dsaStrength < 80;
        if (filterDSA === "low") return scores.dsaStrength < 60;
        return true;
      });
    }

    // Consistency filter
    if (filterConsistency !== "all") {
      filtered = filtered.filter((p) => {
        const scores = calculateScores(p.profile_data);
        if (filterConsistency === "high") return scores.consistency >= 80;
        if (filterConsistency === "medium") return scores.consistency >= 60 && scores.consistency < 80;
        if (filterConsistency === "low") return scores.consistency < 60;
        return true;
      });
    }

    // Interview Readiness filter
    if (filterReadiness !== "all") {
      filtered = filtered.filter((p) => {
        const scores = calculateScores(p.profile_data);
        if (filterReadiness === "faang") return scores.interviewReadiness >= 80;
        if (filterReadiness === "product") return scores.interviewReadiness >= 60 && scores.interviewReadiness < 80;
        if (filterReadiness === "startup") return scores.interviewReadiness >= 40 && scores.interviewReadiness < 60;
        if (filterReadiness === "building") return scores.interviewReadiness < 40;
        return true;
      });
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, filterDSA, filterConsistency, filterReadiness]);

  const getReadinessBadge = (score: number) => {
    if (score >= 80) return { label: "FAANG Ready", color: "bg-green-500" };
    if (score >= 60) return { label: "Product Ready", color: "bg-blue-500" };
    if (score >= 40) return { label: "Startup Ready", color: "bg-purple-500" };
    return { label: "Building", color: "bg-orange-500" };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const handleContactCandidate = (candidate: Profile) => {
    toast({
      title: "Contact Initiated",
      description: `Contact request sent to ${candidate.profile_data.profile.realName || candidate.profile_data.username}`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Candidate data is being exported to CSV",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">
              Find and filter candidates by actual coding ability and verified skills
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Candidates</p>
                    <p className="text-lg font-semibold">{filteredProfiles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green" />
                  <div>
                    <p className="text-xs text-muted-foreground">FAANG Ready</p>
                    <p className="text-lg font-semibold">
                      {filteredProfiles.filter((p) => calculateScores(p.profile_data).interviewReadiness >= 80).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue" />
                  <div>
                    <p className="text-xs text-muted-foreground">Avg DSA Score</p>
                    <p className="text-lg font-semibold">
                      {filteredProfiles.length > 0 
                        ? Math.round(filteredProfiles.reduce((acc, p) => acc + calculateScores(p.profile_data).dsaStrength, 0) / filteredProfiles.length)
                        : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange" />
                  <div>
                    <p className="text-xs text-muted-foreground">High Consistency</p>
                    <p className="text-lg font-semibold">
                      {filteredProfiles.filter((p) => calculateScores(p.profile_data).consistency >= 80).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="glass-card bg-card/50 border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search by name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-secondary/50"
                />
                
                <Select value={filterDSA} onValueChange={setFilterDSA}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="DSA Strength" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All DSA Levels</SelectItem>
                    <SelectItem value="high">High (80+)</SelectItem>
                    <SelectItem value="medium">Medium (60-79)</SelectItem>
                    <SelectItem value="low">Low (&lt;60)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterConsistency} onValueChange={setFilterConsistency}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Consistency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Consistency</SelectItem>
                    <SelectItem value="high">High (80+)</SelectItem>
                    <SelectItem value="medium">Medium (60-79)</SelectItem>
                    <SelectItem value="low">Low (&lt;60)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterReadiness} onValueChange={setFilterReadiness}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Readiness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="faang">FAANG Ready</SelectItem>
                    <SelectItem value="product">Product Company</SelectItem>
                    <SelectItem value="startup">Startup Ready</SelectItem>
                    <SelectItem value="building">Building Foundation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Export Button */}
          <div className="flex justify-end mb-6">
            <Button onClick={handleExportData} variant="outline" className="bg-secondary/50">
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>
          </div>

          {/* Candidate List */}
          <div className="space-y-4">
            {filteredProfiles.map((profile) => {
                      const scores = calculateScores(profile.profile_data);
              const readiness = getReadinessBadge(scores.interviewReadiness);
                      const total = profile.profile_data.submitStats.acSubmissionNum.reduce((acc: number, s) => acc + s.count, 0);

              return (
                <Card key={profile.id} className="glass-card bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {profile.profile_data.profile.realName || profile.profile_data.username}
                          </h3>
                          <p className="text-sm text-muted-foreground">@{profile.profile_data.username}</p>
                        </div>
                        <Badge className={`${readiness.color} text-white`}>
                          {readiness.label}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-secondary/50">
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-cyan to-blue hover:opacity-90"
                          onClick={() => handleContactCandidate(profile)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">DSA Strength</p>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getScoreColor(scores.dsaStrength)}`}>
                            {scores.dsaStrength}/100
                          </span>
                          <Progress value={scores.dsaStrength} className="h-2 flex-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Consistency</p>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getScoreColor(scores.consistency)}`}>
                            {scores.consistency}/100
                          </span>
                          <Progress value={scores.consistency} className="h-2 flex-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Interview Ready</p>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getScoreColor(scores.interviewReadiness)}`}>
                            {scores.interviewReadiness}/100
                          </span>
                          <Progress value={scores.interviewReadiness} className="h-2 flex-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Problems Solved</p>
                        <p className="font-semibold">{total}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>Rank: #{profile.profile_data.profile.ranking?.toLocaleString()}</span>
                      <span>•</span>
                      <span>Rating: {profile.profile_data.contestRating}</span>
                      <span>•</span>
                      <span>Streak: {profile.profile_data.streak} days</span>
                      <span>•</span>
                      <span>Contests: {profile.profile_data.contestAttended}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Candidates Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find candidates.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
