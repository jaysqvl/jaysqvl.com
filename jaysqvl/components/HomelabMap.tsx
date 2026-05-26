'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import {
  Activity,
  Bell,
  Boxes,
  BrainCircuit,
  Camera,
  CircleDot,
  Cloud,
  Cpu,
  Database,
  Filter,
  Globe2,
  HardDrive,
  Home,
  Image,
  KeyRound,
  PanelTop,
  Route,
  Server,
  ShieldCheck,
  TerminalSquare,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import topologyData from '@/data/homelab-topology.json';

type GraphVariant = 'desktop' | 'compact';
type LabTone = 'mint' | 'blue' | 'lavender' | 'amber';
type LinkDirection = 'both' | 'forward' | 'none';
type FlowSide = 'top' | 'right' | 'bottom' | 'left';
type EdgeKind = 'smoothstep' | 'straight';
type NodeKind = 'plain' | 'edge' | 'hub' | 'serviceGroup';

interface NodeLayout {
  x: number;
  y: number;
  width: number;
}

interface LinkLayout {
  points?: number[][];
  labelX?: number;
  labelY?: number;
}

interface LabNode {
  id: string;
  label: string;
  role: string;
  detail: string;
  tags: string[];
  tone: LabTone;
  icon: string;
  layout: Record<GraphVariant, NodeLayout>;
}

interface LabLink {
  id: string;
  source: string;
  target: string;
  label: string;
  direction: LinkDirection;
  tone: LabTone;
  layout?: Record<GraphVariant, LinkLayout>;
}

interface LabTopology {
  version: number;
  title: string;
  nodes: LabNode[];
  links: LabLink[];
}

interface LabNodeData extends Record<string, unknown> {
  labNode: LabNode;
  items: LabNode[];
  active: boolean;
  connected: boolean;
  kind: NodeKind;
  activeId: string;
  onSelect: (nodeId: string) => void;
}

type LabFlowNode = Node<LabNodeData, 'labNode'>;
type LabFlowEdge = Edge<{ tone: LabTone } & Record<string, unknown>>;

const topology = topologyData as unknown as LabTopology;
const nodesById = new Map(topology.nodes.map((node) => [node.id, node]));

const sidePosition: Record<FlowSide, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

const flowHandles: Array<{ side: FlowSide; id: string; style?: CSSProperties }> = [
  { side: 'top', id: 'top' },
  { side: 'top', id: 'top-left', style: { left: '34%' } },
  { side: 'top', id: 'top-right', style: { left: '66%' } },
  { side: 'right', id: 'right' },
  { side: 'right', id: 'right-top', style: { top: '32%' } },
  { side: 'right', id: 'right-bottom', style: { top: '68%' } },
  { side: 'bottom', id: 'bottom' },
  { side: 'bottom', id: 'bottom-left', style: { left: '34%' } },
  { side: 'bottom', id: 'bottom-right', style: { left: '66%' } },
  { side: 'left', id: 'left' },
  { side: 'left', id: 'left-top', style: { top: '32%' } },
  { side: 'left', id: 'left-bottom', style: { top: '68%' } },
];

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  bell: Bell,
  boxes: Boxes,
  brain: BrainCircuit,
  camera: Camera,
  cloud: Cloud,
  cpu: Cpu,
  database: Database,
  filter: Filter,
  globe: Globe2,
  'hard-drive': HardDrive,
  home: Home,
  image: Image,
  key: KeyRound,
  panel: PanelTop,
  route: Route,
  server: Server,
  shield: ShieldCheck,
  terminal: TerminalSquare,
  wifi: Wifi,
  wrench: Wrench,
};

const embeddedNodeIds: Record<string, string[]> = {
  opnsense: ['crowdsec', 'adguard', 'unbound', 'tailscale'],
  'docker-services': [
    'npm',
    'cloudflared',
    'personal-cloud',
    'ai-sandbox',
    'ops-dashboards',
    'automation',
    'camera-smart',
    'utility-tools',
  ],
  'vm-services': ['unifi-os', 'home-assistant', 'lab-vms'],
  'raspberry-pi': ['pi-services'],
};

const visibleNodeIds = [
  'wan',
  'cloudflare',
  'opnsense',
  'unifi-hardware',
  'home-server',
  'raspberry-pi',
  'storage',
  'docker-services',
  'vm-services',
];

const graphLinks: LabLink[] = [
  { id: 'wan-opnsense', source: 'wan', target: 'opnsense', label: 'edge flow', direction: 'both', tone: 'amber' },
  { id: 'cloudflare-docker', source: 'cloudflare', target: 'docker-services', label: 'tunnel', direction: 'both', tone: 'blue' },
  { id: 'opnsense-docker', source: 'opnsense', target: 'docker-services', label: 'proxy ingress', direction: 'both', tone: 'mint' },
  { id: 'opnsense-server', source: 'opnsense', target: 'home-server', label: 'server lan', direction: 'both', tone: 'lavender' },
  { id: 'opnsense-unifi', source: 'opnsense', target: 'unifi-hardware', label: 'lan / vlans', direction: 'both', tone: 'blue' },
  { id: 'opnsense-pi', source: 'opnsense', target: 'raspberry-pi', label: 'isolated lan', direction: 'both', tone: 'amber' },
  { id: 'server-docker', source: 'home-server', target: 'docker-services', label: 'containers', direction: 'both', tone: 'mint' },
  { id: 'server-vms', source: 'home-server', target: 'vm-services', label: 'virtualize', direction: 'both', tone: 'blue' },
  { id: 'server-storage', source: 'home-server', target: 'storage', label: 'storage base', direction: 'both', tone: 'amber' },
];

const edgeRouteOverrides: Record<string, { type?: EdgeKind; sourceHandle?: string; targetHandle?: string }> = {
  'wan-opnsense': { type: 'straight', sourceHandle: 'source-right', targetHandle: 'target-left' },
  'opnsense-server': { type: 'straight', sourceHandle: 'source-right', targetHandle: 'target-left' },
  'opnsense-unifi': { type: 'straight', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
  'opnsense-pi': { sourceHandle: 'source-bottom-right', targetHandle: 'target-left' },
  'opnsense-docker': { sourceHandle: 'source-right-top', targetHandle: 'target-left' },
  'server-docker': { sourceHandle: 'source-right-top', targetHandle: 'target-left-bottom' },
  'server-vms': { sourceHandle: 'source-right-bottom', targetHandle: 'target-left' },
  'server-storage': { type: 'straight', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
};

const ownerByNodeId = new Map<string, string>();

Object.entries(embeddedNodeIds).forEach(([ownerId, itemIds]) => {
  itemIds.forEach((itemId) => ownerByNodeId.set(itemId, ownerId));
});

visibleNodeIds.forEach((nodeId) => ownerByNodeId.set(nodeId, nodeId));

const architectureLayout: Record<GraphVariant, Record<string, { x: number; y: number; width: number }>> = {
  desktop: {
    wan: { x: 24, y: 262, width: 160 },
    cloudflare: { x: 214, y: 76, width: 180 },
    opnsense: { x: 214, y: 218, width: 246 },
    'unifi-hardware': { x: 242, y: 492, width: 190 },
    'home-server': { x: 510, y: 246, width: 220 },
    storage: { x: 520, y: 486, width: 190 },
    'raspberry-pi': { x: 520, y: 628, width: 224 },
    'docker-services': { x: 792, y: 72, width: 330 },
    'vm-services': { x: 792, y: 430, width: 330 },
  },
  compact: {
    wan: { x: 145, y: 24, width: 170 },
    cloudflare: { x: 145, y: 126, width: 170 },
    opnsense: { x: 96, y: 255, width: 268 },
    'unifi-hardware': { x: 145, y: 510, width: 182 },
    'home-server': { x: 120, y: 632, width: 220 },
    'raspberry-pi': { x: 118, y: 760, width: 224 },
    'docker-services': { x: 42, y: 920, width: 376 },
    storage: { x: 120, y: 1235, width: 220 },
    'vm-services': { x: 42, y: 1380, width: 376 },
  },
};

const nodeTypes = {
  labNode: LabNodeCard,
};

function LabNodeCard({ data }: NodeProps<LabFlowNode>) {
  const Icon = iconMap[data.labNode.icon] || CircleDot;

  return (
    <div
      className={`homelab-flow-node homelab-flow-node--${data.labNode.tone} homelab-flow-node--${data.kind} ${
        data.active ? 'homelab-flow-node--active' : ''
      } ${data.connected ? 'homelab-flow-node--connected' : ''}`}
    >
      <GraphHandles />
      <div className="homelab-flow-node__head">
        <span className="homelab-flow-node__icon">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="homelab-flow-node__role">{data.labNode.role}</span>
          <span className="homelab-flow-node__label">{data.labNode.label}</span>
        </span>
      </div>

      {data.items.length > 0 && (
        <div className="homelab-flow-node__items">
          {data.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`homelab-flow-node__chip nodrag nopan ${data.activeId === item.id ? 'homelab-flow-node__chip--active' : ''}`}
              onClick={(event) => {
                event.stopPropagation();
                data.onSelect(item.id);
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseEnter={() => data.onSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GraphHandles() {
  return (
    <>
      {flowHandles.map((handle) => (
        <Handle
          key={`source-${handle.id}`}
          id={`source-${handle.id}`}
          type="source"
          position={sidePosition[handle.side]}
          className="homelab-flow__handle"
          style={handle.style}
        />
      ))}
      {flowHandles.map((handle) => (
        <Handle
          key={`target-${handle.id}`}
          id={`target-${handle.id}`}
          type="target"
          position={sidePosition[handle.side]}
          className="homelab-flow__handle"
          style={handle.style}
        />
      ))}
    </>
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

function getNodeKind(nodeId: string): NodeKind {
  if (nodeId === 'opnsense') {
    return 'edge';
  }

  if (nodeId === 'home-server') {
    return 'hub';
  }

  if (nodeId === 'docker-services' || nodeId === 'vm-services' || nodeId === 'raspberry-pi') {
    return 'serviceGroup';
  }

  return 'plain';
}

function getNodeHeight(nodeId: string) {
  if (nodeId === 'docker-services') {
    return 235;
  }

  if (nodeId === 'opnsense') {
    return 178;
  }

  if (nodeId === 'vm-services') {
    return 152;
  }

  if (nodeId === 'raspberry-pi') {
    return 122;
  }

  return 72;
}

function getGraphOwner(nodeId: string) {
  return ownerByNodeId.get(nodeId) || nodeId;
}

function getGraphLayout(nodeId: string, variant: GraphVariant) {
  return architectureLayout[variant][nodeId];
}

function getGraphCenter(nodeId: string, variant: GraphVariant) {
  const layout = getGraphLayout(nodeId, variant);

  return {
    x: layout.x + layout.width / 2,
    y: layout.y + getNodeHeight(nodeId) / 2,
  };
}

function getHandlePair(sourceId: string, targetId: string, variant: GraphVariant) {
  const sourceCenter = getGraphCenter(sourceId, variant);
  const targetCenter = getGraphCenter(targetId, variant);
  const deltaX = targetCenter.x - sourceCenter.x;
  const deltaY = targetCenter.y - sourceCenter.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0
      ? { sourceHandle: 'source-right', targetHandle: 'target-left' }
      : { sourceHandle: 'source-left', targetHandle: 'target-right' };
  }

  return deltaY > 0
    ? { sourceHandle: 'source-bottom', targetHandle: 'target-top' }
    : { sourceHandle: 'source-top', targetHandle: 'target-bottom' };
}

function createFlowNodes(
  variant: GraphVariant,
  activeId: string,
  connectedIds: Set<string>,
  onSelect: (nodeId: string) => void
): LabFlowNode[] {
  const activeOwner = getGraphOwner(activeId);

  return visibleNodeIds.flatMap((nodeId) => {
    const labNode = nodesById.get(nodeId);
    const layout = getGraphLayout(nodeId, variant);

    if (!labNode || !layout) {
      return [];
    }

    const items = (embeddedNodeIds[nodeId] || []).flatMap((itemId) => {
      const item = nodesById.get(itemId);
      return item ? [item] : [];
    });

    return [
      {
        id: nodeId,
        type: 'labNode',
        position: { x: layout.x, y: layout.y },
        data: {
          labNode,
          items,
          active: activeOwner === nodeId,
          connected: connectedIds.has(nodeId),
          kind: getNodeKind(nodeId),
          activeId,
          onSelect,
        },
        style: { width: layout.width },
        draggable: false,
        selectable: false,
        deletable: false,
      },
    ];
  });
}

function createFlowEdges(variant: GraphVariant, activeId: string): LabFlowEdge[] {
  const activeOwner = getGraphOwner(activeId);

  return graphLinks.map((link) => {
    const isActive = activeOwner === link.source || activeOwner === link.target;
    const handles = {
      ...getHandlePair(link.source, link.target, variant),
      ...edgeRouteOverrides[link.id],
    };
    const marker = {
      type: MarkerType.ArrowClosed,
      width: 14,
      height: 14,
      color: isActive ? 'hsl(var(--foreground) / 0.72)' : `hsl(var(--pastel-${link.tone}) / 0.72)`,
    };

    return {
      id: link.id,
      source: link.source,
      target: link.target,
      type: handles.type || 'smoothstep',
      sourceHandle: handles.sourceHandle,
      targetHandle: handles.targetHandle,
      label: isActive ? link.label : undefined,
      data: { tone: link.tone },
      animated: isActive,
      className: `homelab-flow-edge homelab-flow-edge--${link.tone} ${isActive ? 'homelab-flow-edge--active' : ''}`,
      markerStart: link.direction === 'both' ? marker : undefined,
      markerEnd: link.direction !== 'none' ? marker : undefined,
      labelClassName: 'homelab-flow-edge__label homelab-flow-edge__label--active',
      labelBgBorderRadius: 999,
      labelBgPadding: [7, 4],
      labelBgStyle: { fill: 'hsl(var(--card) / 0.96)' },
    };
  });
}

function FitGraphToCanvas({ variant }: { variant: GraphVariant }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const handle = window.requestAnimationFrame(() => {
      fitView({
        padding: variant === 'compact' ? 0.08 : 0.1,
        duration: 260,
        maxZoom: variant === 'compact' ? 0.96 : 1.04,
      });
    });

    return () => window.cancelAnimationFrame(handle);
  }, [fitView, variant]);

  return null;
}

function HomelabFlow({
  activeId,
  connectedIds,
  onSelect,
  variant,
}: {
  activeId: string;
  connectedIds: Set<string>;
  onSelect: (nodeId: string) => void;
  variant: GraphVariant;
}) {
  const flowNodes = useMemo(
    () => createFlowNodes(variant, activeId, connectedIds, onSelect),
    [activeId, connectedIds, onSelect, variant]
  );
  const flowEdges = useMemo(() => createFlowEdges(variant, activeId), [activeId, variant]);

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: variant === 'compact' ? 0.08 : 0.1, maxZoom: variant === 'compact' ? 0.96 : 1.04 }}
      minZoom={0.38}
      maxZoom={1.3}
      panOnDrag
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
      onNodeClick={(_, node) => onSelect(node.id)}
      onNodeMouseEnter={(_, node) => onSelect(node.id)}
    >
      <Background
        variant={BackgroundVariant.Lines}
        gap={32}
        lineWidth={1}
        color="hsl(var(--border) / 0.2)"
      />
      <Controls className="homelab-flow__controls" showInteractive={false} />
      <FitGraphToCanvas variant={variant} />
    </ReactFlow>
  );
}

export default function HomelabMap() {
  const variant = useGraphVariant();
  const [activeId, setActiveId] = useState('home-server');
  const activeNode = nodesById.get(activeId) || nodesById.get(getGraphOwner(activeId)) || topology.nodes[0];
  const ActiveIcon = iconMap[activeNode.icon] || CircleDot;
  const activeOwner = getGraphOwner(activeId);

  const connectedIds = useMemo(() => {
    const ids = new Set<string>([activeOwner]);

    graphLinks.forEach((link) => {
      if (link.source === activeOwner || link.target === activeOwner) {
        ids.add(link.source);
        ids.add(link.target);
      }
    });

    return ids;
  }, [activeOwner]);

  return (
    <div className="homelab-map" aria-label={topology.title}>
      <div className="homelab-map__canvas">
        <ReactFlowProvider>
          <HomelabFlow activeId={activeId} connectedIds={connectedIds} onSelect={setActiveId} variant={variant} />
        </ReactFlowProvider>
      </div>

      <aside className="homelab-map__detail">
        <div className="flex items-center gap-3">
          <span className={`homelab-map__detail-icon homelab-flow-node--${activeNode.tone}`}>
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
      </aside>
    </div>
  );
}
