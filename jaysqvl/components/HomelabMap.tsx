'use client';

import { useState } from 'react';
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

interface PositionedLabNode extends LabNode {
  x: number;
  y: number;
  icon: LucideIcon;
}

const labNodes: PositionedLabNode[] = [
  {
    id: 'edge',
    label: 'Edge',
    role: 'OPNsense',
    detail: 'Public-safe routing, firewall policy, VPN paths, and the first line between home systems and the internet.',
    tags: ['firewall', 'routing', 'vpn'],
    tone: 'mint',
    x: 11,
    y: 50,
    icon: ShieldCheck,
  },
  {
    id: 'network',
    label: 'Network',
    role: 'UniFi',
    detail: 'Switching and Wi-Fi for trusted devices, guest access, IoT, lab gear, and server traffic without naming private segments.',
    tags: ['switching', 'wifi', 'segmentation'],
    tone: 'blue',
    x: 30,
    y: 28,
    icon: Wifi,
  },
  {
    id: 'server',
    label: 'Home Server',
    role: 'Compute + storage base',
    detail: 'The raw workhorse: NAS, containers, personal cloud replacement, AI experiments, automations, and backups.',
    tags: ['server', 'nas', 'compute'],
    tone: 'lavender',
    x: 50,
    y: 52,
    icon: Server,
  },
  {
    id: 'storage',
    label: 'Storage',
    role: 'NAS + photo library',
    detail: 'Central storage for files, backups, and a self-owned photo workflow that stands in for iCloud-style storage.',
    tags: ['nas', 'photos', 'backups'],
    tone: 'amber',
    x: 70,
    y: 28,
    icon: HardDrive,
  },
  {
    id: 'containers',
    label: 'Containers',
    role: 'Docker services',
    detail: 'Small services, internal tools, dashboards, scripts, and repeatable environments for experiments.',
    tags: ['docker', 'tools', 'automation'],
    tone: 'mint',
    x: 70,
    y: 73,
    icon: Boxes,
  },
  {
    id: 'ai',
    label: 'AI Sandbox',
    role: 'Local experiments',
    detail: 'A place to test retrieval flows, agents, small model-backed utilities, and private prototyping ideas.',
    tags: ['rag', 'agents', 'prototypes'],
    tone: 'blue',
    x: 88,
    y: 56,
    icon: BrainCircuit,
  },
  {
    id: 'home',
    label: 'Smart Home',
    role: 'Automation layer',
    detail: 'Home events, device integrations, and small automations connected through the same server-first mindset.',
    tags: ['events', 'devices', 'scripts'],
    tone: 'lavender',
    x: 48,
    y: 83,
    icon: Home,
  },
  {
    id: 'cloud',
    label: 'Cloud',
    role: 'Public handoff',
    detail: 'Vercel, GCP, Firebase, GitHub, and Nginx Proxy Manager for the public-facing pieces that should leave the house.',
    tags: ['vercel', 'gcp', 'npm proxy'],
    tone: 'amber',
    x: 90,
    y: 21,
    icon: Cloud,
  },
];

const labLinks: LabLink[] = [
  { source: 'edge', target: 'network', label: 'lan' },
  { source: 'network', target: 'server', label: 'trusted' },
  { source: 'server', target: 'storage', label: 'files' },
  { source: 'server', target: 'containers', label: 'compose' },
  { source: 'containers', target: 'ai', label: 'experiments' },
  { source: 'containers', target: 'home', label: 'events' },
  { source: 'containers', target: 'cloud', label: 'proxy' },
  { source: 'storage', target: 'cloud', label: 'selected sync' },
];

const nodesById = new Map(labNodes.map((node) => [node.id, node]));

export default function HomelabMap() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(labNodes[2].id);
  const activeNode = nodesById.get(activeId) || labNodes[2];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="homelab-map">
      <div className="homelab-map__stage" aria-label="Interactive high-level homelab system map">
        <svg className="homelab-map__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {labLinks.map((link) => {
            const source = nodesById.get(link.source);
            const target = nodesById.get(link.target);

            if (!source || !target) {
              return null;
            }

            const isActive = activeId === source.id || activeId === target.id;

            return (
              <g key={`${link.source}-${link.target}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={isActive ? 'homelab-map__link homelab-map__link--active' : 'homelab-map__link'}
                />
                {!reduceMotion && isActive && (
                  <motion.circle
                    r="0.9"
                    className={`homelab-map__packet homelab-map__packet--${activeNode.tone}`}
                    initial={{ cx: source.x, cy: source.y, opacity: 0 }}
                    animate={{ cx: target.x, cy: target.y, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {labNodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeId === node.id;

          return (
            <button
              key={node.id}
              type="button"
              className={`homelab-map__node homelab-map__node--${node.tone} ${
                isActive ? 'homelab-map__node--active' : ''
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setActiveId(node.id)}
              onFocus={() => setActiveId(node.id)}
              onClick={() => setActiveId(node.id)}
              aria-pressed={isActive}
            >
              <Icon className="size-4" />
              <span>{node.label}</span>
            </button>
          );
        })}
      </div>

      <div className="homelab-map__mobile-list">
        {labNodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeId === node.id;

          return (
            <button
              key={node.id}
              type="button"
              className={`homelab-map__mobile-node homelab-map__node--${node.tone} ${
                isActive ? 'homelab-map__mobile-node--active' : ''
              }`}
              onClick={() => setActiveId(node.id)}
            >
              <Icon className="size-4" />
              <span>{node.label}</span>
            </button>
          );
        })}
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
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">public-safe boundary</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This is a capability map, not a live network diagram. No hostnames, IPs, secrets, or private service details.
          </p>
        </div>
      </motion.aside>
    </div>
  );
}
