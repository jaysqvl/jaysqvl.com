import { Card, CardContent } from "@/components/ui/card"
import SkillGraph from "./SkillGraph"

export default function AboutMe() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16" id="about">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
        <div className="w-20 h-1 bg-primary rounded"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Introduction Card */}
        <Card className="lg:col-span-4">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Hey! I'm Jay, a Software Engineer with roots in backend development and AI applications. Currently pursuing my Bachelor's in Computer Science at Simon Fraser University with practical experience in building scalable applications, both mobile and web, with cutting-edge AI integrations. Reach out to me if you'd like to chat about any potential collaborations or just to say hi!
            </p>
          </CardContent>
        </Card>

        {/* Skills Graph */}
        <div className="lg:col-span-8 bg-card rounded-lg border shadow-sm">
          <SkillGraph />
        </div>
      </div>
    </section>
  );
} 