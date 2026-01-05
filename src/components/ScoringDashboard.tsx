import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Zap, Award, BarChart3, Flame } from "lucide-react";

interface ScoringDashboardProps {
  dsaStrength: number;
  consistency: number;
  interviewReadiness: number;
  totalProblems: number;
  streak: number;
  contestRating: number;
}

export function ScoringDashboard({ 
  dsaStrength, 
  consistency, 
  interviewReadiness, 
  totalProblems, 
  streak, 
  contestRating 
}: ScoringDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Work";
  };

  const getReadinessLevel = () => {
    if (interviewReadiness >= 80) return { level: "FAANG Ready", color: "bg-green-500" };
    if (interviewReadiness >= 60) return { level: "Product Company Ready", color: "bg-blue-500" };
    if (interviewReadiness >= 40) return { level: "Startup Ready", color: "bg-purple-500" };
    return { level: "Keep Practicing", color: "bg-orange-500" };
  };

  const readiness = getReadinessLevel();

  return (
    <div className="space-y-6">
      {/* Main Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-cyan" />
              DSA Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getScoreColor(dsaStrength)}`}>
                  {dsaStrength}/100
                </span>
                <Badge variant="outline" className={getScoreColor(dsaStrength)}>
                  {getScoreLabel(dsaStrength)}
                </Badge>
              </div>
              <Progress value={dsaStrength} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on problems solved and topic coverage
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-orange" />
              Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getScoreColor(consistency)}`}>
                  {consistency}/100
                </span>
                <Badge variant="outline" className={getScoreColor(consistency)}>
                  {getScoreLabel(consistency)}
                </Badge>
              </div>
              <Progress value={consistency} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on daily streak and contest participation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-green" />
              Interview Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getScoreColor(interviewReadiness)}`}>
                  {interviewReadiness}/100
                </span>
                <Badge variant="outline" className={getScoreColor(interviewReadiness)}>
                  {getScoreLabel(interviewReadiness)}
                </Badge>
              </div>
              <Progress value={interviewReadiness} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Overall interview preparation score
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Readiness Level Badge */}
      <Card className="glass-card bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-cyan" />
              <div>
                <h3 className="font-semibold text-foreground">Current Level</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your overall performance
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${readiness.color} text-white px-4 py-2 text-sm font-medium`}>
                {readiness.level}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-xs text-muted-foreground">Total Problems</p>
                <p className="text-lg font-semibold">{totalProblems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange" />
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-lg font-semibold">{streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green" />
              <div>
                <p className="text-xs text-muted-foreground">Contest Rating</p>
                <p className="text-lg font-semibold">{contestRating || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow" />
              <div>
                <p className="text-xs text-muted-foreground">Growth Rate</p>
                <p className="text-lg font-semibold">+12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
