import { LeetCodeStats } from "@/hooks/useLeetCodeStats";
import { SkillRadar } from "./SkillRadar";
import { ReadinessScore } from "./ReadinessScore";
import { ResumeGenerator } from "./ResumeGenerator";
import { ScoringDashboard } from "./ScoringDashboard";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, TrendingUp, Award, Zap } from "lucide-react";

interface LeetCodeProfileProps {
  stats: LeetCodeStats;
}

export function LeetCodeProfile({ stats }: LeetCodeProfileProps) {
  const easy = stats.submitStats.acSubmissionNum.find(s => s.difficulty === "Easy")?.count || 0;
  const medium = stats.submitStats.acSubmissionNum.find(s => s.difficulty === "Medium")?.count || 0;
  const hard = stats.submitStats.acSubmissionNum.find(s => s.difficulty === "Hard")?.count || 0;
  const total = easy + medium + hard;

  // Build skill data from tags
  const allSkills = [
    ...stats.skillStats.advanced,
    ...stats.skillStats.intermediate,
    ...stats.skillStats.fundamental,
  ].sort((a, b) => b.problemsSolved - a.problemsSolved);

  // Enhanced scoring algorithm for CodeProfile.ai
  const calculateScores = () => {
    // DSA Strength Score (0-100)
    const problemScore = Math.min(100, (easy * 1 + medium * 2 + hard * 4) / 20);
    const topicScore = Math.min(100, (allSkills.length * 5)); // 5 points per topic
    const dsaStrength = Math.round((problemScore + topicScore) / 2);

    // Consistency Score (0-100)
    const streakScore = Math.min(100, stats.streak * 3); // 3 points per streak day
    const contestBonus = stats.contestAttended > 0 ? Math.min(20, stats.contestAttended * 2) : 0;
    const consistency = Math.round(streakScore + contestBonus);

    // Interview Readiness Score (0-100)
    const difficultyBalance = (hard * 4 + medium * 2 + easy * 1) / (total || 1);
    const contestPerformance = stats.contestRating > 0 ? Math.min(30, stats.contestRating / 30) : 0;
    const totalProblemsScore = Math.min(30, total / 20);
    const interviewReadiness = Math.round(
      (dsaStrength * 0.4 + consistency * 0.3 + difficultyBalance * 0.2 + contestPerformance + totalProblemsScore)
    );

    return { dsaStrength, consistency, interviewReadiness };
  };

  const { dsaStrength, consistency, interviewReadiness } = calculateScores();

  const topSkills = allSkills.slice(0, 6);
  const maxProblems = Math.max(...topSkills.map(s => s.problemsSolved), 1);
  
  const skillData = topSkills.map(skill => ({
    name: skill.tagName,
    value: Math.round((skill.problemsSolved / maxProblems) * 100),
  }));

  // Pad with empty skills if less than 6
  while (skillData.length < 6) {
    skillData.push({ name: "—", value: 0 });
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <ResumeGenerator stats={stats} />
        </div>
        <div className="flex items-center gap-4">
          <img 
            src={stats.profile.userAvatar || "/placeholder.svg"} 
            alt={stats.username}
            className="w-20 h-20 rounded-full border-2 border-cyan/50"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{stats.username}</h2>
            {stats.profile.realName && (
              <p className="text-muted-foreground">{stats.profile.realName}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="border-cyan/50 text-cyan">
                Rank #{stats.profile.ranking?.toLocaleString() || "N/A"}
              </Badge>
              {stats.streak > 0 && (
                <Badge variant="outline" className="border-orange/50 text-orange">
                  <Flame className="w-3 h-3 mr-1" />
                  {stats.streak} day streak
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Problems Solved" value={total} color="cyan" />
        <StatCard icon={Trophy} label="Contest Rating" value={Math.round(stats.contestRating)} color="yellow" />
        <StatCard icon={TrendingUp} label="Contests Attended" value={stats.contestAttended} color="purple" />
        <StatCard icon={Flame} label="Current Streak" value={stats.streak} color="orange" suffix=" days" />
      </div>

      {/* Problem Distribution */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Problem Distribution</h3>
        <div className="space-y-4">
          <ProblemBar label="Easy" count={easy} total={850} color="from-green to-cyan" />
          <ProblemBar label="Medium" count={medium} total={1800} color="from-yellow to-orange" />
          <ProblemBar label="Hard" count={hard} total={750} color="from-orange to-red-500" />
        </div>
      </div>

      {/* Scoring Dashboard - CodeProfile.ai Core Feature */}
      <ScoringDashboard
        dsaStrength={dsaStrength}
        consistency={consistency}
        interviewReadiness={interviewReadiness}
        totalProblems={total}
        streak={stats.streak}
        contestRating={Math.round(stats.contestRating)}
      />

      {/* Skills & Readiness */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Skills</h3>
          <SkillRadar skills={skillData} />
        </div>
        
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">Interview Readiness</h3>
          <div className="flex flex-col items-center">
            <ReadinessScore score={interviewReadiness} />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {interviewReadiness >= 80 ? "Ready for FAANG interviews!" :
                 interviewReadiness >= 60 ? "Almost there! Keep practicing." :
                 interviewReadiness >= 40 ? "Good progress. Focus on Hard problems." :
                 "Keep grinding! Start with Easy problems."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {stats.badges.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow" />
            Badges ({stats.badges.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {stats.badges.slice(0, 10).map((badge) => (
              <div 
                key={badge.id}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-full"
              >
                {badge.icon && <img src={badge.icon} alt="" className="w-5 h-5" />}
                <span className="text-sm text-foreground">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Skills List */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan" />
          Skill Breakdown
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <SkillCategory title="Advanced" skills={stats.skillStats.advanced.slice(0, 5)} color="purple" />
          <SkillCategory title="Intermediate" skills={stats.skillStats.intermediate.slice(0, 5)} color="cyan" />
          <SkillCategory title="Fundamental" skills={stats.skillStats.fundamental.slice(0, 5)} color="green" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, suffix = "" }: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "text-cyan",
    yellow: "text-yellow",
    purple: "text-purple",
    orange: "text-orange",
  };

  return (
    <div className="glass-card p-4 rounded-xl text-center">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${colorClasses[color]}`} />
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ProblemBar({ label, count, total, color }: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = Math.min((count / total) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{count} / {total}</span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SkillCategory({ title, skills, color }: {
  title: string;
  skills: { tagName: string; problemsSolved: number }[];
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    purple: "text-purple border-purple/30",
    cyan: "text-cyan border-cyan/30",
    green: "text-green border-green/30",
  };

  return (
    <div>
      <h4 className={`text-sm font-semibold mb-3 ${colorClasses[color].split(" ")[0]}`}>{title}</h4>
      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.tagName} className="flex justify-between items-center text-sm">
            <span className="text-foreground">{skill.tagName}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs border ${colorClasses[color]}`}>
              {skill.problemsSolved}
            </span>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-muted-foreground text-sm">No skills yet</p>
        )}
      </div>
    </div>
  );
}
