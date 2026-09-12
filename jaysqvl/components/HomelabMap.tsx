'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Controls, Handle, Position, ReactFlow, ReactFlowProvider,
  type Edge, type Node, type NodeMouseHandler, type NodeProps,
} from '@xyflow/react';
import { Cloud, Computer, Cpu, Globe2, Network, Server, ShieldCheck, Wifi, type LucideIcon } from 'lucide-react';
import topology from '@/data/homelab-topology.json';
import styles from './HomelabMap.module.css';

type LabNode = (typeof topology.nodes)[number];
type Selection = { activeId: string; onSelect: (id: string) => void };
type DeviceData = Selection & { nodeId: string } & Record<string, unknown>;
type DeviceNode = Node<DeviceData, 'device'>;

const byId = new Map(topology.nodes.map((node) => [node.id, node]));
const routerServices = ['crowdsec', 'adguard', 'unbound', 'tailscale'];
const connectivityHardware = ['unifi-switch', 'other-switches', 'moca-adapters', 'powerline-adapters'];
const dockerServices = ['npm', 'cloudflared', 'personal-cloud', 'ai-sandbox', 'ops-dashboards', 'automation', 'camera-smart', 'utility-tools'];
const vmServices = ['unifi-os', 'home-assistant', 'lab-vms'];
const macServices = ['mac-remote-development', 'mac-llm-hosting'];
const serverContents = ['docker-services', ...dockerServices, 'vm-services', ...vmServices, 'storage'];
const owners = new Map<string, string>([
  ...routerServices.map((id) => [id, 'opnsense'] as const),
  ...connectivityHardware.map((id) => [id, 'switching'] as const),
  ['unifi-e7', 'unifi-wifi'],
  ...serverContents.map((id) => [id, 'home-server'] as const),
  ['pi-services', 'raspberry-pi'],
  ...macServices.map((id) => [id, 'mac-mini'] as const),
]);
const icons: Record<string, LucideIcon> = {
  wan: Globe2, cloudflare: Cloud, opnsense: ShieldCheck,
  switching: Network, 'unifi-wifi': Wifi, 'home-server': Server, 'raspberry-pi': Cpu,
  'mac-mini': Computer,
};

// Workloads are contained inside their hosts; lines represent network connections.
const layout = [
  { id: 'cloudflare', x: 16, y: 64, width: 240 },
  { id: 'wan', x: 16, y: 242, width: 240 },
  { id: 'opnsense', x: 304, y: 170, width: 240 },
  { id: 'switching', x: 304, y: 430, width: 240 },
  { id: 'unifi-wifi', x: 16, y: 430, width: 240 },
  { id: 'home-server', x: 608, y: 64, width: 480 },
  { id: 'raspberry-pi', x: 608, y: 550, width: 224 },
  { id: 'mac-mini', x: 864, y: 550, width: 224 },
];
const connections: Edge[] = [
  { id: 'wan-router', source: 'wan', target: 'opnsense', sourceHandle: 'right', targetHandle: 'left', type: 'straight' },
  { id: 'router-switch', source: 'opnsense', target: 'switching', sourceHandle: 'bottom', targetHandle: 'top', type: 'straight' },
  { id: 'switch-wifi', source: 'switching', target: 'unifi-wifi', sourceHandle: 'wifi', targetHandle: 'uplink', type: 'straight' },
  { id: 'switch-server', source: 'switching', target: 'home-server', sourceHandle: 'hosts', targetHandle: 'network', type: 'smoothstep' },
  { id: 'switch-pi', source: 'switching', target: 'raspberry-pi', sourceHandle: 'hosts', targetHandle: 'top', type: 'smoothstep' },
  { id: 'switch-mac', source: 'switching', target: 'mac-mini', sourceHandle: 'hosts', targetHandle: 'top', type: 'smoothstep' },
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
      {nodeId === 'switching' && (
        <div className={styles.routerServices}><ServiceList ids={connectivityHardware} {...selection} /></div>
      )}
      {nodeId === 'unifi-wifi' && (
        <div className={styles.routerServices}><ServiceList ids={['unifi-e7']} {...selection} /></div>
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
      {nodeId === 'mac-mini' && (
        <div className={styles.workloads}><ServiceList ids={macServices} {...selection} /></div>
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
      {data.nodeId === 'switching' && (
        <>
          <Handle id="wifi" type="source" position={Position.Left} style={{ top: 41 }} className={styles.handle} />
          <Handle id="hosts" type="source" position={Position.Right} style={{ top: 80 }} className={styles.handle} />
        </>
      )}
      {data.nodeId === 'unifi-wifi' && (
        <Handle id="uplink" type="target" position={Position.Right} style={{ top: 41 }} className={styles.handle} />
      )}
      {data.nodeId === 'home-server' && (
        <>
          <Handle id="network" type="target" position={Position.Left} style={{ top: 282 }} className={styles.handle} />
          <Handle id="tunnel" type="target" position={Position.Left} style={{ top: 41 }} className={styles.handle} />
        </>
      )}
      <Device {...data} />
    </>
  );
}

const nodeTypes = { device: FlowDevice };
const fitViewOptions = { padding: 0.045, maxZoom: 1.05 };
const proOptions = { hideAttribution: true };

function DesktopMap({ activeId, onSelect }: Selection) {
  const owner = owners.get(activeId) || activeId;
  const nodes: DeviceNode[] = useMemo(() => layout.map(({ id, x, y, width }) => ({
    id, type: 'device', position: { x, y }, style: { width },
    data: { nodeId: id, activeId, onSelect },
    draggable: false, selectable: false, focusable: false,
  })), [activeId, onSelect]);
  const edges = useMemo(() => connections.map((connection) => {
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
  }), [owner]);
  const onNodeClick = useCallback<NodeMouseHandler<DeviceNode>>((_, node) => onSelect(node.id), [onSelect]);
  return (
    <div className={styles.desktop}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          fitView fitViewOptions={fitViewOptions}
          minZoom={0.6} maxZoom={1.5}
          nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
          onNodeClick={onNodeClick}
          panOnDrag zoomOnScroll={false} zoomOnDoubleClick={false} zoomOnPinch
          proOptions={proOptions}
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
        <Device nodeId="switching" {...selection} />
      </div>
      <div className={styles.mobileSection}>
        <h3>Connected devices</h3>
        <div className={styles.mobileBranches}>
          {['unifi-wifi', 'home-server', 'raspberry-pi', 'mac-mini'].map((id) => (
            <div key={id} className={styles.mobileBranch}>
              <Device nodeId={id} {...selection} />
            </div>
          ))}
        </div>
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
