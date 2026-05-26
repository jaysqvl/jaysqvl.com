'use client';

import { useMemo, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BrainCircuit, Boxes, Cloud, HardDrive, Home, Server, ShieldCheck, Wifi, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type LabNodeId = 'edge' | 'network' | 'server' | 'storage' | 'containers' | 'ai' | 'home' | 'cloud';
type LabTone = 'mint' | 'blue' | 'lavender' | 'amber';

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
  height: number;
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
    x: 95,
    y: 255,
    width: 142,
    height: 72,
  },
  {
    id: 'network',
    label: 'Network',
    role: 'UniFi',
    detail: 'Switching and Wi-Fi for trusted devices, guests, IoT gear, lab boxes, and server traffic.',
    tags: ['switching', 'wifi', 'segmentation'],
    tone: 'blue',
    x: 282,
    y: 160,
    width: 150,
    height: 72,
  },
  {
    id: 'server',
    label: 'Server',
    role: 'The workhorse',
    detail: 'NAS, Docker host, photo storage, backups, AI experiments, smart-home glue, and random weekend ideas.',
    tags: ['server', 'nas', 'compute'],
    tone: 'lavender',
    x: 470,
    y: 275,
    width: 168,
    height: 82,
  },
  {
    id: 'storage',
    label: 'Storage',
    role: 'NAS + photos',
    detail: 'Central file storage and a self-owned photo workflow that replaces a chunk of subscription cloud dependence.',
    tags: ['photos', 'files', 'backups'],
    tone: 'amber',
    x: 675,
    y: 130,
    width: 152,
    height: 72,
  },
  {
    id: 'containers',
    label: 'Containers',
    role: 'Docker stack',
    detail: 'Small apps, notes, dashboards, private tools, and scripts that are easier to run when they live beside the data.',
    tags: ['docker', 'tools', 'jobs'],
    tone: 'mint',
    x: 690,
    y: 310,
    width: 164,
    height: 78,
  },
  {
    id: 'ai',
    label: 'AI Sandbox',
    role: 'Experiments',
    detail: 'A place for retrieval tests, agents, document indexing, and prototypes before they deserve a real deployment.',
    tags: ['rag', 'agents', 'prototypes'],
    tone: 'blue',
    x: 855,
    y: 245,
    width: 150,
    height: 72,
  },
  {
    id: 'home',
    label: 'Smart Home',
    role: 'Automation',
    detail: 'Device events, routines, and house logic treated like software instead of a mystery app drawer.',
    tags: ['events', 'devices', 'routines'],
    tone: 'lavender',
    x: 685,
    y: 470,
    width: 150,
    height: 72,
  },
  {
    id: 'cloud',
    label: 'Cloud Edge',
    role: 'NPM proxy',
    detail: 'The public-facing handoff for the few services that should be reachable, alongside Vercel, GCP, and Firebase work.',
    tags: ['nginx proxy manager', 'vercel', 'gcp'],
    tone: 'amber',
    x: 835,
    y: 78,
    width: 156,
    height: 72,
  },
];

const compactNodeLayout: Record<LabNodeId, Pick<LabNode, 'x' | 'y' | 'width' | 'height'>> = {
  cloud: { x: 195, y: 64, width: 150, height: 66 },
  edge: { x: 92, y: 168, width: 128, height: 64 },
  network: { x: 266, y: 168, width: 132, height: 64 },
  server: { x: 195, y: 292, width: 160, height: 76 },
  storage: { x: 94, y: 424, width: 132, height: 64 },
  containers: { x: 266, y: 424, width: 142, height: 68 },
  ai: { x: 94, y: 570, width: 132, height: 64 },
  home: { x: 266, y: 570, width: 132, height: 64 },
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

export default function HomelabMap() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<LabNodeId>('server');
  const activeNode = nodesById.get(activeId) || labNodes[2];
  const ActiveIcon = iconMap[activeNode.id];

  const activeLinks = useMemo(
    () => labLinks.filter((link) => link.source === activeId || link.target === activeId),
    [activeId]
  );

  const connectedIds = useMemo(() => {
    const ids = new Set([activeId]);
    activeLinks.forEach((link) => {
      ids.add(link.source);
      ids.add(link.target);
    });
    return ids;
  }, [activeId, activeLinks]);

  const handleNodeKeyDown = (event: KeyboardEvent<SVGGElement>, nodeId: LabNodeId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveId(nodeId);
    }
  };

  const renderGraph = (nodes: LabNode[], variant: 'desktop' | 'compact', viewBox: string, width: number, height: number) => {
    const graphNodesById = new Map(nodes.map((node) => [node.id, node]));

    return (
      <svg
        className={`homelab-graph homelab-graph--${variant}`}
        viewBox={viewBox}
        role="img"
        aria-labelledby={`homelab-graph-title-${variant}`}
      >
        <title id={`homelab-graph-title-${variant}`}>Homelab topology graph</title>

        <defs>
          <pattern id={`homelab-grid-${variant}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" className="homelab-graph__grid-line" fill="none" />
          </pattern>
        </defs>

        <rect width={width} height={height} rx="12" className="homelab-graph__background" />
        <rect width={width} height={height} rx="12" fill={`url(#homelab-grid-${variant})`} opacity="0.75" />

        <g className="homelab-graph__links">
          {labLinks.map((link) => {
            const source = graphNodesById.get(link.source);
            const target = graphNodesById.get(link.target);

            if (!source || !target) {
              return null;
            }

            const isActive = activeId === source.id || activeId === target.id;
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            return (
              <g key={`${variant}-${link.source}-${link.target}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={isActive ? 'homelab-graph__link homelab-graph__link--active' : 'homelab-graph__link'}
                />
                <text x={midX} y={midY - 7} className="homelab-graph__link-label">
                  {link.label}
                </text>
                {!reduceMotion && isActive && (
                  <motion.circle
                    r="5"
                    className={`homelab-graph__packet homelab-graph__node--${activeNode.tone}`}
                    initial={{ cx: source.x, cy: source.y, opacity: 0 }}
                    animate={{ cx: target.x, cy: target.y, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </g>
            );
          })}
        </g>

        <g className="homelab-graph__nodes">
          {nodes.map((node) => {
            const Icon = iconMap[node.id];
            const isActive = activeId === node.id;
            const isConnected = connectedIds.has(node.id);

            return (
              <g
                key={`${variant}-${node.id}`}
                className={`homelab-graph__node homelab-graph__node--${node.tone} ${
                  isActive ? 'homelab-graph__node--active' : ''
                } ${isConnected ? 'homelab-graph__node--connected' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`${node.label}: ${node.role}`}
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
                onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
              >
                <rect
                  x={node.x - node.width / 2}
                  y={node.y - node.height / 2}
                  width={node.width}
                  height={node.height}
                  rx="12"
                  className="homelab-graph__node-shell"
                />
                <circle
                  cx={node.x - node.width / 2 + 22}
                  cy={node.y - node.height / 2 + 22}
                  r="10"
                  className="homelab-graph__tone"
                />
                <Icon
                  x={node.x - node.width / 2 + 14}
                  y={node.y - node.height / 2 + 14}
                  width={16}
                  height={16}
                  className="homelab-graph__icon"
                />
                <text x={node.x - node.width / 2 + 42} y={node.y - node.height / 2 + 24} className="homelab-graph__role">
                  {node.role}
                </text>
                <text x={node.x - node.width / 2 + 18} y={node.y + 18} className="homelab-graph__label">
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div className="homelab-map" aria-label="High-level homelab topology graph">
      <div className="homelab-map__canvas">
        {renderGraph(labNodes, 'desktop', '0 0 980 560', 980, 560)}
        {renderGraph(compactLabNodes, 'compact', '0 0 390 660', 390, 660)}
      </div>

      <motion.aside
        key={activeNode.id}
        className="homelab-map__detail"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
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
      </motion.aside>
    </div>
  );
}
