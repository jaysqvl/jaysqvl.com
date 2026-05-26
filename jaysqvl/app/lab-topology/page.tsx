import HomelabMap from '@/components/HomelabMap';
import topology from '@/data/homelab-topology.json';

export default function LabTopologyPreview() {
  return (
    <main className="min-h-screen border-b border-border pt-24">
      <section className="section-shell pb-16">
        <div className="section-kicker">topology preview</div>
        <div className="mb-8 grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <h1 className="section-title">Review the graph before it becomes the graph.</h1>
          </div>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            The visual below is rendered directly from JSON. Change the nodes, positions, or edges in one place and the
            diagram follows.
          </p>
        </div>

        <HomelabMap />

        <div className="mt-8 rounded-md border border-border bg-card/82 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Source topology JSON</h2>
            <code className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              data/homelab-topology.json
            </code>
          </div>
          <pre className="max-h-[32rem] overflow-auto rounded-md border border-border bg-background/72 p-4 text-xs leading-6 text-muted-foreground">
            {JSON.stringify(topology, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}
