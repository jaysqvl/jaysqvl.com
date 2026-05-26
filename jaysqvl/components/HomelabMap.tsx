'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BrainCircuit,
  Boxes,
  Cloud,
  HardDrive,
  Home,
  LucideIcon,
  Server,
  ShieldCheck,
  Wifi,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface LabNode {
  id: string;
  label: string;
  role: string;
  detail: string;
  tags: string[];
  tone: string;
}

export interface LabLink {
  source: string;
  target: string;
  label?: string;
}

interface TopologyNode extends LabNode {
  area: string;
  icon: LucideIcon;
}

const labNodes: TopologyNode[] = [
  {
    id: 'edge',
    label: 'Edge',
    role: 'OPNsense',
    detail: 'Firewall, routes, VPN paths, and the front door for anything leaving or entering the house.',
    tags: ['firewall', 'routing', 'vpn'],
    tone: 'mint',
    area: 'edge',
    icon: ShieldCheck,
  },
  {
    id: 'network',
    label: 'Network',
    role: 'UniFi',
    detail: 'Switching and Wi-Fi for trusted devices, guests, IoT gear, lab boxes, and server traffic.',
    tags: ['switching', 'wifi', 'segmentation'],
    tone: 'blue',
    area: 'network',
    icon: Wifi,
  },
  {
    id: 'server',
    label: 'Server',
    role: 'The workhorse',
    detail: 'NAS, Docker host, photo storage, backups, AI experiments, smart-home glue, and random weekend ideas.',
    tags: ['server', 'nas', 'compute'],
    tone: 'lavender',
    area: 'server',
    icon: Server,
  },
  {
    id: 'storage',
    label: 'Storage',
    role: 'NAS + photos',
    detail: 'Central file storage and a self-owned photo workflow that replaces a chunk of subscription cloud dependence.',
    tags: ['photos', 'files', 'backups'],
    tone: 'amber',
    area: 'storage',
    icon: HardDrive,
  },
  {
    id: 'containers',
    label: 'Containers',
    role: 'Docker stack',
    detail: 'Small apps, notes, dashboards, private tools, and scripts that are easier to run when they live beside the data.',
    tags: ['docker', 'tools', 'jobs'],
    tone: 'mint',
    area: 'containers',
    icon: Boxes,
  },
  {
    id: 'ai',
    label: 'AI Sandbox',
    role: 'Local experiments',
    detail: 'A place for retrieval tests, agents, document indexing, and prototypes before they deserve a real deployment.',
    tags: ['rag', 'agents', 'prototypes'],
    tone: 'blue',
    area: 'ai',
    icon: BrainCircuit,
  },
  {
    id: 'home',
    label: 'Smart Home',
    role: 'Automation layer',
    detail: 'Device events, routines, and house logic treated like software instead of a mystery app drawer.',
    tags: ['events', 'devices', 'routines'],
    tone: 'lavender',
    area: 'home',
    icon: Home,
  },
  {
    id: 'cloud',
    label: 'Cloud Edge',
    role: 'Nginx Proxy Manager',
    detail: 'The public-facing handoff for the few services that should be reachable, alongside Vercel, GCP, and Firebase work.',
    tags: ['npm proxy', 'vercel', 'gcp'],
    tone: 'amber',
    area: 'cloud',
    icon: Cloud,
  },
];

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
  const [activeId, setActiveId] = useState('server');
  const activeNode = nodesById.get(activeId) || labNodes[2];
  const ActiveIcon = activeNode.icon;

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

  return (
    <div className="homelab-map" aria-label="High-level homelab topology">
      <div className="homelab-map__topology">
        {labNodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeId === node.id;
          const isConnected = connectedIds.has(node.id);

          return (
            <button
              key={node.id}
              type="button"
              className={`homelab-map__card homelab-map__card--${node.area} homelab-map__node--${node.tone} ${
                isActive ? 'homelab-map__card--active' : ''
              } ${isConnected ? 'homelab-map__card--connected' : ''}`}
              onMouseEnter={() => setActiveId(node.id)}
              onFocus={() => setActiveId(node.id)}
              onClick={() => setActiveId(node.id)}
              aria-pressed={isActive}
            >
              <span className="homelab-map__card-top">
                <span className="homelab-map__card-icon">
                  <Icon className="size-4" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {node.role}
                </span>
              </span>
              <span className="mt-4 block text-left text-xl font-semibold">{node.label}</span>
              <span className="mt-3 block text-left text-sm leading-6 text-muted-foreground">{node.detail}</span>
            </button>
          );
        })}

        <div className="homelab-map__flow">
          <span className="homelab-map__flow-label">
            {activeLinks.length > 0 ? activeLinks.map((link) => link.label).join(' / ') : 'selected node'}
          </span>
          <span className="homelab-map__flow-line">
            {!reduceMotion && <span className={`homelab-map__flow-packet homelab-map__node--${activeNode.tone}`} />}
          </span>
        </div>
      </div>

      <motion.aside
        key={activeNode.id}
        className="homelab-map__detail"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3">
          <span className={`homelab-map__detail-icon homelab-map__node--${activeNode.tone}`}>
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
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">what is not shown</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Hostnames, IPs, exact dashboards, and private service details. The point is the shape of the system, not a map
            of the house.
          </p>
        </div>
      </motion.aside>
    </div>
  );
}
