'use client';

import { useMemo, useState } from 'react';
import {
  Controls, Handle, Position, ReactFlow, ReactFlowProvider,
  type Edge, type Node, type NodeProps,
} from '@xyflow/react';
import { Cloud, Cpu, Globe2, Server, ShieldCheck, Wifi, type LucideIcon } from 'lucide-react';
import topology from '@/data/homelab-topology.json';
import styles from './HomelabMap.module.css';

type LabNode = (typeof topology.nodes)[number];
type Selection = { activeId: string; onSelect: (id: string) => void };
type DeviceData = Selection & { nodeId: string } & Record<string, unknown>;
type DeviceNode = Node<DeviceData, 'device'>;

const byId = new Map(topology.nodes.map((node) => [node.id, node]));
const routerServices = ['crowdsec', 'adguard', 'unbound', 'tailscale'];
const dockerServices = ['npm', 'cloudflared', 'personal-cloud', 'ai-sandbox', 'ops-dashboards', 'automation', 'camera-smart', 'utility-tools'];
const vmServices = ['unifi-os', 'home-assistant', 'lab-vms'];
const serverContents = ['docker-services', ...dockerServices, 'vm-services', ...vmServices, 'storage'];
const owners = new Map<string, string>([
  ...routerServices.map((id) => [id, 'opnsense'] as const),
  ...serverContents.map((id) => [id, 'home-server'] as const),
  ['pi-services', 'raspberry-pi'],
]);
const icons: Record<string, LucideIcon> = {
  wan: Globe2, cloudflare: Cloud, opnsense: ShieldCheck,
  'unifi-hardware': Wifi, 'home-server': Server, 'raspberry-pi': Cpu,
};

// Workloads are contained inside their hosts; lines represent network connections.
const layout = [
  { id: 'cloudflare', x: 16, y: 126, width: 168 },
  { id: 'wan', x: 16, y: 282, width: 168 },
  { id: 'opnsense', x: 230, y: 210, width: 222 },
  { id: 'unifi-hardware', x: 230, y: 570, width: 222 },
  { id: 'home-server', x: 534, y: 40, width: 560 },
  { id: 'raspberry-pi', x: 534, y: 550, width: 560 },
];
const connections: Edge[] = [
  { id: 'wan-router', source: 'wan', target: 'opnsense', sourceHandle: 'right', targetHandle: 'left', type: 'straight' },
  { id: 'router-server', source: 'opnsense', target: 'home-server', sourceHandle: 'right', targetHandle: 'network', type: 'straight' },
  { id: 'router-wifi', source: 'opnsense', target: 'unifi-hardware', sourceHandle: 'bottom', targetHandle: 'top', type: 'straight' },
  { id: 'router-pi', source: 'opnsense', target: 'raspberry-pi', sourceHandle: 'branch', targetHandle: 'left', type: 'smoothstep' },
  { id: 'tunnel', source: 'cloudflare', target: 'home-server', sourceHandle: 'right', targetHandle: 'tunnel', type: 'straight' },
];

function getNode(id: string): LabNode {
  const node = byId.get(id);
  if (!node) throw new Error('Unknown homelab node: ' + id);
  return node;
}

function SelectNode({ id, activeId, onSelect, heading = false, icon = false }: Selection & {
  id: string; heading?: boolean; icon?: boolean;
}) {
  const node = getNode(id);
  const Icon = icons[id];
  const selected = activeId === id;
  return (
    <div className={styles.selection}>
      <button
        type="button"
        className={[styles.select, heading ? styles.heading : styles.item, 'nodrag nopan'].join(' ')}
        aria-pressed={selected}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(id);
        }}
      >
        {icon && Icon && <Icon size={20} strokeWidth={1.5} aria-hidden="true" />}
        <span>
          {heading && icon && <span className={styles.role}>{node.role}</span>}
          <span>{id === 'wan' ? 'Internet' : node.label}</span>
        </span>
        <span className={styles.selectionMark} aria-hidden="true">{selected ? '•' : '›'}</span>
      </button>
      {selected && <p className={styles.inlineDetail}>{node.detail}</p>}
    </div>
  );
}

function ServiceList({ ids, columns = false, ...selection }: Selection & { ids: string[]; columns?: boolean }) {
  return (
    <ul className={[styles.services, columns ? styles.twoColumns : ''].join(' ')}>
      {ids.map((id) => <li key={id}><SelectNode id={id} {...selection} /></li>)}
    </ul>
  );
}

function Device({ nodeId, ...selection }: DeviceData) {
  const owner = owners.get(selection.activeId) || selection.activeId;
  return (
    <div className={[styles.device, owner === nodeId ? styles.related : ''].join(' ')}>
      <SelectNode id={nodeId} heading icon {...selection} />
      {nodeId === 'opnsense' && (
        <div className={styles.routerServices}><ServiceList ids={routerServices} {...selection} /></div>
      )}
      {nodeId === 'home-server' && (
        <>
          <div className={styles.workloads}>
            <SelectNode id="docker-services" heading {...selection} />
            <ServiceList ids={dockerServices} columns {...selection} />
          </div>
          <div className={styles.serverBase}>
            <div className={styles.workloads}>
              <SelectNode id="vm-services" heading {...selection} />
              <ServiceList ids={vmServices} {...selection} />
            </div>
            <div className={styles.storage}>
              <SelectNode id="storage" heading {...selection} />
              <p>Files, photo libraries,<br />and backups.</p>
            </div>
          </div>
        </>
      )}
      {nodeId === 'raspberry-pi' && (
        <div className={styles.piServices}><ServiceList ids={['pi-services']} {...selection} /></div>
      )}
    </div>
  );
}

function FlowDevice({ data }: NodeProps<DeviceNode>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className={styles.handle} />
      <Handle id="top" type="target" position={Position.Top} className={styles.handle} />
      <Handle id="right" type="source" position={Position.Right} className={styles.handle} />
      <Handle id="bottom" type="source" position={Position.Bottom} className={styles.handle} />
      <Handle id="branch" type="source" position={Position.Right} style={{ top: '80%' }} className={styles.handle} />
      {data.nodeId === 'home-server' && (
        <>
          <Handle id="network" type="target" position={Position.Left} style={{ top: 282 }} className={styles.handle} />
          <Handle id="tunnel" type="target" position={Position.Left} style={{ top: 126 }} className={styles.handle} />
        </>
      )}
      <Device {...data} />
    </>
  );
}

const nodeTypes = { device: FlowDevice };

function DesktopMap({ activeId, onSelect }: Selection) {
  const owner = owners.get(activeId) || activeId;
  const nodes: DeviceNode[] = useMemo(() => layout.map(({ id, x, y, width }) => ({
    id, type: 'device', position: { x, y }, style: { width },
    data: { nodeId: id, activeId, onSelect },
    draggable: false, selectable: false, focusable: false,
  })), [activeId, onSelect]);
  const edges = connections.map((connection) => {
    const related = connection.source === owner || connection.target === owner;
    return {
      ...connection, focusable: false,
      style: {
        stroke: 'hsl(var(--muted-foreground))',
        strokeWidth: related ? 1.8 : 1.2,
        opacity: related ? 1 : 0.8,
        strokeDasharray: connection.id === 'tunnel' ? '5 5' : undefined,
      },
    };
  });
  return (
    <div className={styles.desktop}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          fitView fitViewOptions={{ padding: 0.045, maxZoom: 1.05 }}
          minZoom={0.6} maxZoom={1.5}
          nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
          onNodeClick={(_, node) => onSelect(node.id)}
          panOnDrag zoomOnScroll={false} zoomOnDoubleClick={false} zoomOnPinch
          proOptions={{ hideAttribution: true }}
        >
          <Controls className={styles.controls} showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

function MobileMap(selection: Selection) {
  return (
    <div className={styles.mobile}>
      <div className={styles.mobileSection}>
        <h3>Network</h3>
        <Device nodeId="wan" {...selection} />
        <div className={styles.mobileConnection} aria-hidden="true" />
        <Device nodeId="opnsense" {...selection} />
        <div className={styles.mobileConnection} aria-hidden="true" />
        <Device nodeId="unifi-hardware" {...selection} />
      </div>
      <div className={styles.mobileSection}>
        <h3>Hosts</h3>
        <p className={styles.connectionNote}>The home server and Raspberry Pi connect to OPNsense.</p>
        <Device nodeId="home-server" {...selection} />
        <Device nodeId="raspberry-pi" {...selection} />
      </div>
      <div className={styles.mobileSection}>
        <h3>Cloudflare tunnel</h3>
        <p className={styles.connectionNote}>Connects Cloudflare to the container services on the home server.</p>
        <Device nodeId="cloudflare" {...selection} />
      </div>
    </div>
  );
}

export default function HomelabMap() {
  const [activeId, setActiveId] = useState('home-server');
  const active = getNode(activeId);
  const selection = useMemo(() => ({ activeId, onSelect: setActiveId }), [activeId]);
  return (
    <div className={styles.map} aria-label={topology.title}>
      <div className={styles.toolbar}>
        <span>Simplified overview</span>
        <div className={styles.legend} aria-label="Connection legend">
          <span><i />Network</span>
          <span><i className={styles.tunnelLine} />Tunnel</span>
        </div>
        <span className={styles.hint}>Select a device or service</span>
      </div>
      <DesktopMap {...selection} />
      <MobileMap {...selection} />
      <div className={styles.detail} aria-live="polite" aria-atomic="true">
        <div><span className={styles.role}>{active.role}</span><h3>{active.label}</h3></div>
        <p>{active.detail}</p>
      </div>
    </div>
  );
}
