import { useEffect, useState } from "react";

const defaultSkills = [
  { name: "Arrays", value: 92, color: "hsl(186, 100%, 50%)" },
  { name: "Dynamic Programming", value: 78, color: "hsl(210, 100%, 56%)" },
  { name: "Graphs", value: 85, color: "hsl(142, 76%, 45%)" },
  { name: "Trees", value: 88, color: "hsl(45, 100%, 51%)" },
  { name: "Strings", value: 95, color: "hsl(25, 100%, 55%)" },
  { name: "Binary Search", value: 82, color: "hsl(270, 100%, 64%)" },
];

const skillColors = [
  "hsl(186, 100%, 50%)",
  "hsl(210, 100%, 56%)",
  "hsl(142, 76%, 45%)",
  "hsl(45, 100%, 51%)",
  "hsl(25, 100%, 55%)",
  "hsl(270, 100%, 64%)",
];

interface SkillRadarProps {
  skills?: { name: string; value: number }[];
}

export function SkillRadar({ skills: propSkills }: SkillRadarProps) {
  const skills = propSkills?.map((s, i) => ({ ...s, color: skillColors[i % skillColors.length] })) || defaultSkills;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;
  const levels = 5;

  // Calculate points for the radar
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Create polygon points
  const polygonPoints = skills
    .map((skill, index) => {
      const point = getPoint(index, animated ? skill.value : 0);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div className="relative">
      <svg width="300" height="300" className="mx-auto">
        {/* Background circles */}
        {Array.from({ length: levels }).map((_, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={((i + 1) / levels) * maxRadius}
            fill="none"
            stroke="hsl(222, 30%, 18%)"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {skills.map((_, index) => {
          const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
          const endX = centerX + maxRadius * Math.cos(angle);
          const endY = centerY + maxRadius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="hsl(222, 30%, 18%)"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="hsl(186, 100%, 50%)"
          fillOpacity={0.2}
          stroke="hsl(186, 100%, 50%)"
          strokeWidth="2"
          className="transition-all duration-1000 ease-out"
        />

        {/* Data points */}
        {skills.map((skill, index) => {
          const point = getPoint(index, animated ? skill.value : 0);
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="6"
              fill={skill.color}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${skill.color})` }}
            />
          );
        })}

        {/* Labels */}
        {skills.map((skill, index) => {
          const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
          const labelRadius = maxRadius + 30;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs font-medium"
            >
              {skill.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
