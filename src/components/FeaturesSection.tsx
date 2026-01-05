import { FeatureCard } from "./FeatureCard";
import { 
  BarChart3, 
  FileText, 
  RefreshCw, 
  Shield, 
  Target, 
  Users 
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Skill Analytics",
    description: "AI-powered analysis of your problem-solving patterns. Get insights on topic mastery, difficulty progression, and areas for improvement.",
  },
  {
    icon: FileText,
    title: "One-Click Resume",
    description: "Generate job-ready resumes with verified DSA stats. Tailored formats for FAANG, startups, or service companies.",
  },
  {
    icon: Target,
    title: "Interview Readiness Score",
    description: "Know exactly when you're ready. Our algorithm analyzes topic coverage, difficulty balance, and consistency to show your true level.",
  },
  {
    icon: RefreshCw,
    title: "Auto Profile Updates",
    description: "Never manually update again. We sync your progress weekly and notify you about achievements and skill decay warnings.",
  },
  {
    icon: Shield,
    title: "Verified Credentials",
    description: "Every stat on your profile is verified from LeetCode. No more fake claims — recruiters can trust what they see.",
  },
  {
    icon: Users,
    title: "Recruiter Dashboard",
    description: "Companies can filter candidates by actual ability. Search by topics, consistency streaks, and contest performance.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Stand Out</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We've built the complete toolkit to transform your coding practice into career opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
