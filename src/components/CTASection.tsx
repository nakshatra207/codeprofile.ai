import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card p-12 glow-effect">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm mb-8">
            <Rocket className="w-4 h-4" />
            <span>Free to get started</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="gradient-text">Level Up</span>
            {" "}Your Career?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using CodeProfile.ai to land their dream jobs. 
            Your next opportunity is just one profile away.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Create Your Free Profile
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="lg">
              Schedule a Demo
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm mt-6">
            No credit card required • Set up in 2 minutes • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
