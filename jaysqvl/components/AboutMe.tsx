import { Card, CardContent } from "@/components/ui/card"
import SkillGraph from "./SkillGraph"

export default function AboutMe() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16" id="about">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
        <div className="w-20 h-1 bg-primary rounded"></div>
      </div>

      <div className="space-y-8">
        {/* Introduction Card - 1/3 width on large screens */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <p className="text-muted-foreground">
            Hey! I'm Jay, a Software Engineer with roots in backend development and AI applications. Currently pursuing
            my Bachelor's in Computer Science at Simon Fraser University with practical experience in building scalable
            applications, both mobile and web, with cutting-edge AI integrations. Reach out to me if you'd like to chat
            about any potential collaborations or just to say hi!
          </p>
        </div>

        {/* Skills Graph - 2/3 width on large screens */}
        <div className="bg-card rounded-lg border shadow-sm">
          <SkillGraph />
        </div>
      </div>
    </section>
  );
} 