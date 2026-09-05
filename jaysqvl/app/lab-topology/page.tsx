import HomelabMap from '@/components/HomelabMap';

export default function LabTopologyPreview() {
  return (
    <main className="min-h-screen border-b border-border pt-24">
      <section className="section-shell pb-16">
        <div className="mb-8">
          <h1 className="section-title">My homelab</h1>
          <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
            My home network, server, and the services I run on them.
          </p>
        </div>

        <HomelabMap />

      </section>
    </main>
  );
}
