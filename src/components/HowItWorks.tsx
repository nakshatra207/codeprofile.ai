import { Link2, Sparkles, Send } from "lucide-react";

const steps = [
  {
    icon: Link2,
    number: "01",
    title: "Connect Your LeetCode",
    description: "Simply enter your LeetCode username. We'll automatically fetch all your stats, problems solved, and contest history.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI Analyzes Your Skills",
    description: "Our algorithm processes your solving patterns, topic strengths, consistency, and growth trajectory to create your unique profile.",
  },
  {
    icon: Send,
    number: "03",
    title: "Share & Get Hired",
    description: "Share your verified profile with recruiters, add it to your resume, or let companies discover you through our platform.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It{" "}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From LeetCode account to job-ready profile in under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-px bg-gradient-to-r from-cyan/50 to-transparent" />
              )}
              
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/20 mb-6 relative">
                  <step.icon className="w-12 h-12 text-cyan" />
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-blue flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
