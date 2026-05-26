'use client';

import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { BrainCircuit, Boxes, Cloud, HardDrive, Home, Server, ShieldCheck, Wifi, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type LabNodeId = 'edge' | 'network' | 'server' | 'storage' | 'containers' | 'ai' | 'home' | 'cloud';
type LabTone = 'mint' | 'blue' | 'lavender' | 'amber';
type GraphVariant = 'desktop' | 'compact';

export interface LabNode {
  id: LabNodeId;
  label: string;
  role: string;
  detail: string;
  tags: string[];
  tone: LabTone;
  x: number;
  y: number;
  width: number;
}

export interface LabLink {
  source: LabNodeId;
  target: LabNodeId;
  label: string;
}

const iconMap: Record<LabNodeId, LucideIcon> = {
  edge: ShieldCheck,
  network: Wifi,
  server: Server,
  storage: HardDrive,
  containers: Boxes,
  ai: BrainCircuit,
  home: Home,
  cloud: Cloud,
};

const labNodes: LabNode[] = [
  {
    id: 'edge',
    label: 'Edge',
    role: 'OPNsense',
    detail: 'Firewall, routes, VPN paths, and the front door for anything leaving or entering the house.',
    tags: ['firewall', 'routing', 'vpn'],
    tone: 'mint',
    x: 10,
    y: 48,
    width: 142,
  },
  {
    id: 'network',
    label: 'Network',
    role: 'UniFi',
    detail: 'Switching and Wi-Fi for trusted devices, guests, IoT gear, lab boxes, and server traffic.',
    tags: ['switching', 'wifi', 'segmentation'],
    tone: 'blue',
    x: 29,
    y: 28,
    width: 150,
  },
  {
    id: 'server',
    label: 'Server',
    role: 'The workhorse',
    detail: 'NAS, Docker host, photo storage, backups, AI experiments, smart-home glue, and random weekend ideas.',
    tags: ['server', 'nas', 'compute'],
    tone: 'lavender',
    x: 48,
    y: 50,
    width: 172,
  },
  {
    id: 'storage',
    label: 'Storage',
    role: 'NAS + photos',
    detail: 'Central file storage and a self-owned photo workflow that replaces a chunk of subscription cloud dependence.',
    tags: ['photos', 'files', 'backups'],
    tone: 'amber',
    x: 69,
    y: 23,
    width: 152,
  },
  {
    id: 'containers',
    label: 'Containers',
    role: 'Docker stack',
    detail: 'Small apps, notes, dashboards, private tools, and scripts that are easier to run when they live beside the data.',
    tags: ['docker', 'tools', 'jobs'],
    tone: 'mint',
    x: 70,
    y: 57,
    width: 164,
  },
  {
    id: 'ai',
    label: 'AI Sandbox',
    role: 'Experiments',
    detail: 'A place for retrieval tests, agents, document indexing, and prototypes before they deserve a real deployment.',
    tags: ['rag', 'agents', 'prototypes'],
    tone: 'blue',
    x: 88,
    y: 46,
    width: 150,
  },
  {
    id: 'home',
    label: 'Smart Home',
    role: 'Automation',
    detail: 'Device events, routines, and house logic treated like software instead of a mystery app drawer.',
    tags: ['events', 'devices', 'routines'],
    tone: 'lavender',
    x: 70,
    y: 82,
    width: 150,
  },
  {
    id: 'cloud',
    label: 'Cloud Edge',
    role: 'NPM proxy',
    detail: 'The public-facing handoff for the few services that should be reachable, alongside Vercel, GCP, and Firebase work.',
    tags: ['nginx proxy manager', 'vercel', 'gcp'],
    tone: 'amber',
    x: 86,
    y: 13,
    width: 156,
  },
];

const compactNodeLayout: Record<LabNodeId, Pick<LabNode, 'x' | 'y' | 'width'>> = {
  cloud: { x: 50, y: 9, width: 144 },
  edge: { x: 24, y: 24, width: 126 },
  network: { x: 76, y: 24, width: 130 },
  server: { x: 50, y: 43, width: 154 },
  storage: { x: 24, y: 62, width: 126 },
  containers: { x: 76, y: 62, width: 136 },
  ai: { x: 24, y: 84, width: 126 },
  home: { x: 76, y: 84, width: 126 },
};

const compactLabNodes: LabNode[] = labNodes.map((node) => ({
  ...node,
  ...compactNodeLayout[node.id],
}));

const labLinks: LabLink[] = [
  { source: 'edge', target: 'network', label: 'lan' },
  { source: 'network', target: 'server', label: 'wired core' },
  { source: 'server', target: 'storage', label: 'files' },
  { source: 'server', target: 'containers', label: 'compose' },
  { source: 'containers', target: 'ai', label: 'experiments' },
  { source: 'containers', target: 'home', label: 'events' },
  { source: 'containers', target: 'cloud', label: 'proxy' },
  { source: 'storage', target: 'cloud', label: 'selective sync' },
];

const nodesById = new Map(labNodes.map((node) => [node.id, node]));

interface GraphViewProps {
  activeId: LabNodeId;
  connectedIds: Set<LabNodeId>;
  nodes: LabNode[];
  onSelect: (nodeId: LabNodeId) => void;
  variant: GraphVariant;
}

function GraphView({ activeId, connectedIds, nodes, onSelect, variant }: GraphViewProps) {
  const graphNodesById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const handleNodeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, nodeId: LabNodeId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(nodeId);
    }
  };

  return (
    <div className={`homelab-graph homelab-graph--${variant}`}>
      <svg className="homelab-graph__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {labLinks.map((link) => {
          const source = graphNodesById.get(link.source);
          const target = graphNodesById.get(link.target);

          if (!source || !target) {
            return null;
          }

          const isActive = activeId === source.id || activeId === target.id;

          return (
            <line
              key={`${variant}-${link.source}-${link.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              className={isActive ? 'homelab-graph__link homelab-graph__link--active' : 'homelab-graph__link'}
            />
          );
        })}
      </svg>

      {labLinks.map((link) => {
        const source = graphNodesById.get(link.source);
        const target = graphNodesById.get(link.target);

        if (!source || !target) {
          return null;
        }

        const labelStyle = {
          left: `${(source.x + target.x) / 2}%`,
          top: `${(source.y + target.y) / 2}%`,
        } satisfies CSSProperties;

        return (
          <span key={`${variant}-${link.source}-${link.target}-label`} className="homelab-graph__link-label" style={labelStyle}>
            {link.label}
          </span>
        );
      })}

      {nodes.map((node) => {
        const Icon = iconMap[node.id];
        const isActive = activeId === node.id;
        const isConnected = connectedIds.has(node.id);
        const nodeStyle = {
          left: `${node.x}%`,
          top: `${node.y}%`,
          width: node.width,
        } satisfies CSSProperties;

        return (
          <button
            key={`${variant}-${node.id}`}
            type="button"
            className={`homelab-graph__node homelab-graph__node--${node.tone} ${
              isActive ? 'homelab-graph__node--active' : ''
            } ${isConnected ? 'homelab-graph__node--connected' : ''}`}
            style={nodeStyle}
            aria-pressed={isActive}
            onClick={() => onSelect(node.id)}
            onFocus={() => onSelect(node.id)}
            onMouseEnter={() => onSelect(node.id)}
            onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
          >
            <span className="homelab-graph__node-icon">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="homelab-graph__role">{node.role}</span>
            <span className="homelab-graph__label">{node.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function useGraphVariant() {
  const [variant, setVariant] = useState<GraphVariant>('desktop');

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const syncVariant = () => setVariant(query.matches ? 'compact' : 'desktop');

    syncVariant();
    query.addEventListener('change', syncVariant);

    return () => query.removeEventListener('change', syncVariant);
  }, []);

  return variant;
}

export default function HomelabMap() {
  const variant = useGraphVariant();
  const graphNodes = variant === 'compact' ? compactLabNodes : labNodes;
  const [activeId, setActiveId] = useState<LabNodeId>('server');
  const activeNode = nodesById.get(activeId) || labNodes[2];
  const ActiveIcon = iconMap[activeNode.id];

  const activeLinks = useMemo(
    () => labLinks.filter((link) => link.source === activeId || link.target === activeId),
    [activeId]
  );

  const connectedIds = useMemo(() => {
    const ids = new Set<LabNodeId>([activeId]);

    activeLinks.forEach((link) => {
      ids.add(link.source);
      ids.add(link.target);
    });

    return ids;
  }, [activeId, activeLinks]);

  return (
    <div className="homelab-map" aria-label="High-level homelab topology graph">
      <div className="homelab-map__canvas">
        <GraphView activeId={activeId} connectedIds={connectedIds} nodes={graphNodes} onSelect={setActiveId} variant={variant} />
      </div>

      <aside className="homelab-map__detail">
        <div className="flex items-center gap-3">
          <span className={`homelab-map__detail-icon homelab-graph__node--${activeNode.tone}`}>
            <ActiveIcon className="size-5" />
          </span>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{activeNode.role}</p>
            <h3 className="mt-1 text-2xl font-semibold">{activeNode.label}</h3>
          </div>
        </div>

        <p className="mt-5 leading-7 text-muted-foreground">{activeNode.detail}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {activeNode.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="badge-soft">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-6 rounded-md border border-border bg-muted/34 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">private by design</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            No hostnames, IPs, exact dashboards, or service internals. Just the public shape of the setup.
          </p>
        </div>
      </aside>
    </div>
  );
}
