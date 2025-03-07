'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';

// Define the extended ForceGraphMethods type with width and height
interface ExtendedForceGraphMethods extends ForceGraphMethods {
  width: (width: number) => void;
  height: (height: number) => void;
}

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
});

// Define types for our graph data
type SkillCategory = 'languages' | 'frameworks' | 'ai' | 'cloud' | 'databases' | 'testing' | 'knowledge';

interface SkillNode extends NodeObject {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  group: number;
  color?: string;
}

interface SkillLink extends LinkObject {
  source: string;
  target: string;
  strength?: number;
}

interface GraphData {
  nodes: SkillNode[];
  links: SkillLink[];
}

// Define our skills data
const skillsData: GraphData = {
  nodes: [
    // Languages
    { id: 'python', name: 'Python', category: 'languages', level: 90, group: 1 },
    { id: 'javascript', name: 'JavaScript', category: 'languages', level: 85, group: 1 },
    { id: 'java', name: 'Java', category: 'languages', level: 80, group: 1 },
    { id: 'kotlin', name: 'Kotlin', category: 'languages', level: 75, group: 1 },
    { id: 'cpp', name: 'C++', category: 'languages', level: 70, group: 1 },
    
    // Frameworks
    { id: 'react', name: 'React.js', category: 'frameworks', level: 85, group: 2 },
    { id: 'nextjs', name: 'Next.js', category: 'frameworks', level: 80, group: 2 },
    { id: 'nodejs', name: 'Node.js', category: 'frameworks', level: 75, group: 2 },
    { id: 'flask', name: 'Flask', category: 'frameworks', level: 70, group: 2 },
    { id: 'android', name: 'Android', category: 'frameworks', level: 70, group: 2 },
    { id: 'express', name: 'Express', category: 'frameworks', level: 75, group: 2 },
    
    // AI
    { id: 'langchain', name: 'Langchain', category: 'ai', level: 85, group: 3 },
    { id: 'huggingface', name: 'HuggingFace', category: 'ai', level: 80, group: 3 },
    { id: 'transformers', name: 'Transformers', category: 'ai', level: 75, group: 3 },
    { id: 'computer-vision', name: 'Computer Vision', category: 'ai', level: 70, group: 3 },
    
    // Cloud
    { id: 'gcp', name: 'Google Cloud', category: 'cloud', level: 85, group: 4 },
    { id: 'aws', name: 'AWS', category: 'cloud', level: 75, group: 4 },
    { id: 'docker', name: 'Docker', category: 'cloud', level: 80, group: 4 },
    
    // Databases
    { id: 'postgresql', name: 'PostgreSQL', category: 'databases', level: 85, group: 5 },
    { id: 'redis', name: 'Redis', category: 'databases', level: 75, group: 5 },
    { id: 'firebase', name: 'Firebase', category: 'databases', level: 80, group: 5 },
    
    // Testing
    { id: 'jest', name: 'Jest', category: 'testing', level: 75, group: 6 },
    { id: 'pytest', name: 'PyTest', category: 'testing', level: 80, group: 6 },
    { id: 'junit', name: 'JUnit', category: 'testing', level: 75, group: 6 },
  ],
  links: [
    // Language Connections
    { source: 'python', target: 'langchain' },
    { source: 'python', target: 'flask' },
    { source: 'python', target: 'pytest' },
    { source: 'python', target: 'computer-vision' },
    { source: 'javascript', target: 'react' },
    { source: 'javascript', target: 'nodejs' },
    { source: 'javascript', target: 'jest' },
    { source: 'java', target: 'junit' },
    { source: 'java', target: 'android' },
    { source: 'kotlin', target: 'android' },
    { source: 'cpp', target: 'computer-vision' },
    
    // Framework Connections
    { source: 'react', target: 'nextjs' },
    { source: 'react', target: 'jest' },
    { source: 'nodejs', target: 'express' },
    { source: 'nodejs', target: 'firebase' },
    { source: 'flask', target: 'postgresql' },
    { source: 'android', target: 'firebase' },
    
    // AI Connections
    { source: 'langchain', target: 'huggingface' },
    { source: 'langchain', target: 'transformers' },
    { source: 'huggingface', target: 'transformers' },
    { source: 'huggingface', target: 'computer-vision' },
    { source: 'computer-vision', target: 'gcp' },
    
    // Cloud Connections
    { source: 'docker', target: 'gcp' },
    { source: 'docker', target: 'aws' },
    { source: 'gcp', target: 'firebase' },
    { source: 'aws', target: 'postgresql' },
    
    // Database Connections
    { source: 'postgresql', target: 'redis' },
    { source: 'postgresql', target: 'firebase' },
    { source: 'redis', target: 'nodejs' },
    { source: 'firebase', target: 'gcp' },
    
    // Testing Connections
    { source: 'jest', target: 'nodejs' },
    { source: 'pytest', target: 'flask' },
    { source: 'junit', target: 'android' },
    
    // Add direct connections between testing tools
    { source: 'jest', target: 'pytest' },
    { source: 'pytest', target: 'junit' },
    { source: 'jest', target: 'junit' },
    
    // Cross-category Connections
    { source: 'python', target: 'docker' },
    { source: 'javascript', target: 'aws' },
    { source: 'java', target: 'postgresql' },
    { source: 'react', target: 'firebase' },
    { source: 'nodejs', target: 'redis' },
  ]
};

// Color scheme for different categories
const categoryColors: Record<SkillCategory, string> = {
  languages: '#FF6B6B',
  frameworks: '#4ECDC4',
  ai: '#45B7D1',
  cloud: '#96CEB4',
  databases: '#FFEEAD',
  testing: '#D4A5A5',
  knowledge: '#9FA8DA'
};

// Constants for graph visualization
const GRAPH_CONFIG = {
  nodeRadius: 35,
  fontSize: 12,
  minLinkDistance: 150,
  maxLinkDistance: 250,
  chargeStrength: -400,
  chargeDistanceMax: 100,
  centerStrength: 0.05,
  collisionStrength: 1.5,
  collisionRadiusOffset: 2,
  width: 800,
  height: 600,
};

export default function SkillGraph() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [mounted, setMounted] = useState(false);
  const [graphData, setGraphData] = useState(skillsData);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle container resizing
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial size
    updateDimensions();
    
    // Create resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [mounted]);

  // Delayed initialization to ensure dimensions are properly set
  useEffect(() => {
    if (!mounted || dimensions.width === 0) return;
    
    // Only run once when dimensions are first available
    if (!isInitialized) {
      // Delay initialization to ensure dimensions are properly applied
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [mounted, dimensions, isInitialized]);

  // Update graph data when category changes
  useEffect(() => {
    if (!mounted || !isInitialized) return;

    if (!selectedCategory) {
      setGraphData(skillsData);
    } else {
      // Get primary nodes (selected category)
      const primaryNodes = skillsData.nodes.filter(node => node.category === selectedCategory);
      const primaryNodeIds = new Set(primaryNodes.map(node => node.id));

      // Find all connected nodes and their links
      const connectedNodes = new Set<string>();
      const relevantLinks = skillsData.links.filter(link => {
        const source = (typeof link.source === 'object' && link.source !== null) ? 
          (link.source as SkillNode).id : 
          link.source as string;
        const target = (typeof link.target === 'object' && link.target !== null) ? 
          (link.target as SkillNode).id : 
          link.target as string;
        
        // If either end is in our primary nodes, keep this link and both nodes
        if (primaryNodeIds.has(source) || primaryNodeIds.has(target)) {
          connectedNodes.add(source);
          connectedNodes.add(target);
          return true;
        }
        return false;
      });

      // Get all nodes that are part of our filtered graph
      const relevantNodes = skillsData.nodes.filter(node => 
        connectedNodes.has(node.id)
      );

      setGraphData({
        nodes: relevantNodes,
        links: relevantLinks
      });
    }
  }, [selectedCategory, mounted, isInitialized]);

  // Calculate dynamic link distance based on node count
  const calculateLinkDistance = useCallback((nodeCount: number) => {
    // Scale between min and max link distance based on node count
    // Fewer nodes -> shorter distance, more nodes -> longer distance
    const minNodes = 5;  // Minimum nodes to consider
    const maxNodes = skillsData.nodes.length;  // Maximum possible nodes
    
    // Clamp node count between min and max
    const clampedCount = Math.max(minNodes, Math.min(maxNodes, nodeCount));
    
    // Calculate scaling factor (0 to 1)
    const scaleFactor = (clampedCount - minNodes) / (maxNodes - minNodes);
    
    // Calculate distance using linear interpolation
    return GRAPH_CONFIG.minLinkDistance + 
           scaleFactor * (GRAPH_CONFIG.maxLinkDistance - GRAPH_CONFIG.minLinkDistance);
  }, []);

  // Initialize forces when component mounts or graph data changes
  useEffect(() => {
    if (!graphRef.current || !mounted || dimensions.width === 0 || !isInitialized) return;

    const fg = graphRef.current;
    
    // Calculate dynamic link distance based on current node count
    const linkDistance = calculateLinkDistance(graphData.nodes.length);

    // Reset forces with adjusted parameters for better clustering
    fg.d3Force('charge')
      ?.strength(GRAPH_CONFIG.chargeStrength)
      ?.distanceMax(GRAPH_CONFIG.chargeDistanceMax);

    fg.d3Force('link')
      ?.distance(linkDistance)
      ?.strength(0.7);

    fg.d3Force('center')
      ?.strength(GRAPH_CONFIG.centerStrength);

    fg.d3Force('collision')
      ?.strength(GRAPH_CONFIG.collisionStrength)
      ?.radius((node: NodeObject) => GRAPH_CONFIG.nodeRadius * (1 + GRAPH_CONFIG.collisionRadiusOffset));

    // Reheat the simulation
    fg.d3ReheatSimulation();

    // Center the graph
    requestAnimationFrame(() => {
      fg.zoomToFit(400, 50);
    });
  }, [mounted, graphData, dimensions, isInitialized, calculateLinkDistance]);

  const handleNodeClick = useCallback((node: NodeObject) => {
    const skillNode = node as SkillNode;
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-lg bg-card" ref={containerRef}>
      {/* Graph container - now first in DOM order */}
      <div className="absolute inset-0">
        {dimensions.width > 0 && (
          <ForceGraph2D
            ref={graphRef}
            graphData={isInitialized ? graphData : { nodes: [], links: [] }}
            backgroundColor="transparent"
            width={dimensions.width}
            height={dimensions.height}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const skillNode = node as SkillNode;
              const label = skillNode.name;
              const nodeR = GRAPH_CONFIG.nodeRadius;
              
              // Draw node circle with border
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, nodeR, 0, 2 * Math.PI, false);
              ctx.fillStyle = categoryColors[skillNode.category];
              ctx.fill();
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Draw label
              ctx.font = `bold ${GRAPH_CONFIG.fontSize}px Inter, system-ui, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000000';
              
              // Handle multi-word labels
              const words = label.split(' ');
              if (words.length > 1) {
                const lineHeight = GRAPH_CONFIG.fontSize + 2;
                words.forEach((word, i) => {
                  const y = node.y! + (i - (words.length - 1) / 2) * lineHeight;
                  ctx.fillText(word, node.x!, y);
                });
              } else {
                ctx.fillText(label, node.x!, node.y!);
              }
            }}
            nodeRelSize={GRAPH_CONFIG.nodeRadius}
            linkWidth={2}
            linkColor={() => 'rgba(0, 0, 0, 0.2)'}
            onNodeClick={handleNodeClick}
            cooldownTicks={100}
            d3VelocityDecay={0.2}
            warmupTicks={50}
          />
        )}
      </div>

      {/* Buttons overlay - now after graph in DOM */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-4">
        <div className="flex gap-1.5">
          {(Object.keys(categoryColors) as SkillCategory[]).map((category) => (
            <button
              key={category}
              style={{
                backgroundColor: selectedCategory === category ? categoryColors[category] : `${categoryColors[category]}33`,
                color: selectedCategory === category ? '#000000' : '#000000',
                border: `2px solid ${categoryColors[category]}`
              }}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-opacity-80"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        {selectedCategory && (
          <button
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors ml-2"
            onClick={() => setSelectedCategory(null)}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
} 