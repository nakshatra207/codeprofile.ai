import { useEffect, useState } from "react";

interface StatsCardProps {
  label: string;
  value: number;
  suffix?: string;
  color: "cyan" | "green" | "yellow" | "orange";
  delay?: number;
}

const colorClasses = {
  cyan: "from-cyan to-blue",
  green: "from-green to-cyan",
  yellow: "from-yellow to-orange",
  orange: "from-orange to-red-500",
};

export function StatsCard({ label, value, suffix = "", color, delay = 0 }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(visibilityTimer);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, visible]);

  return (
    <div 
      className={`glass-card p-6 text-center transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className={`text-4xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
        {displayValue}{suffix}
      </div>
      <div className="text-muted-foreground text-sm mt-2">{label}</div>
    </div>
  );
}
