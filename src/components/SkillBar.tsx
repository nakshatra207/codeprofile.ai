import { useEffect, useState } from "react";

interface SkillBarProps {
  name: string;
  level: "Easy" | "Medium" | "Hard";
  count: number;
  total: number;
  delay?: number;
}

const levelColors = {
  Easy: "from-green to-cyan",
  Medium: "from-yellow to-orange",
  Hard: "from-orange to-red-500",
};

const levelBgColors = {
  Easy: "bg-green/20",
  Medium: "bg-yellow/20",
  Hard: "bg-orange/20",
};

export function SkillBar({ name, level, count, total, delay = 0 }: SkillBarProps) {
  const [width, setWidth] = useState(0);
  const percentage = (count / total) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${levelBgColors[level]} text-foreground`}>
          {count}/{total}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${levelColors[level]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
