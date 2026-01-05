import { SkillRadar } from "./SkillRadar";
import { SkillBar } from "./SkillBar";
import { ReadinessScore } from "./ReadinessScore";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target, Zap } from "lucide-react";

export function ProfileDemo() {
  return (
    <div className="glass-card p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-blue flex items-center justify-center text-2xl font-bold text-primary-foreground">
          RA
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">Rahul Agarwal</h3>
          <p className="text-muted-foreground text-sm">Full Stack Developer • 2024 Graduate</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="bg-cyan/20 text-cyan border-cyan/30">
              <Flame className="w-3 h-3 mr-1" />
              180 Day Streak
            </Badge>
            <Badge variant="secondary" className="bg-green/20 text-green border-green/30">
              <Trophy className="w-3 h-3 mr-1" />
              Top 5%
            </Badge>
            <Badge variant="secondary" className="bg-yellow/20 text-yellow border-yellow/30">
              <Zap className="w-3 h-3 mr-1" />
              Contest Rating: 1847
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Skill Radar */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Topic Mastery
          </h4>
          <SkillRadar />
        </div>

        {/* Right side - Stats */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Problems Solved
            </h4>
            <div className="space-y-4">
              <SkillBar name="Easy" level="Easy" count={245} total={300} delay={100} />
              <SkillBar name="Medium" level="Medium" count={178} total={400} delay={200} />
              <SkillBar name="Hard" level="Hard" count={62} total={150} delay={300} />
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Interview Readiness
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <ReadinessScore score={92} label="FAANG" />
              <ReadinessScore score={88} label="Startups" />
              <ReadinessScore score={95} label="Service" />
            </div>
          </div>
        </div>
      </div>

      {/* Verified Badge */}
      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Target className="w-4 h-4 text-cyan" />
          <span>Profile verified and auto-updated weekly</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Last synced: 2 hours ago
        </div>
      </div>
    </div>
  );
}
