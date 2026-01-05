import { ProfileDemo } from "./ProfileDemo";

export function ProfileShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Profile,{" "}
            <span className="gradient-text">Reimagined</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how your LeetCode stats transform into a professional profile that recruiters actually want to see.
          </p>
        </div>

        <ProfileDemo />
      </div>
    </section>
  );
}
