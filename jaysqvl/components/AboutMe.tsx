import HomelabMap from '@/components/HomelabMap';

export default function AboutMe() {
  return (
    <section id="lab" className="section-band">
      <div className="section-shell">
        <div className="max-w-2xl">
          <h2 className="section-title">My homelab</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            I run photo storage, backups, containers, and home automation on my own hardware. It’s also where I try out networking setups and work on side projects.
          </p>
        </div>
        <div className="mt-10">
          <HomelabMap />
        </div>
      </div>
    </section>
  );
}
