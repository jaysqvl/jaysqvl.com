'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { NodeObject, LinkObject } from 'react-force-graph-2d';
import { useTheme } from 'next-themes';

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d').then((mod) => mod.default),
  { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
  }
);

// Define types for our graph data
type SkillCategory = 'languages' | 'frameworks' | 'database' | 'dev' | 'test' | 'cloud' | 'knowledge';

interface SkillNode extends NodeObject {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  group: number;
  color?: string;
  isLeaf?: boolean;  // Adding explicit type for isLeaf property
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
    { id: 'bash', name: 'Bash', category: 'languages', level: 75, group: 1 },
    { id: 'c', name: 'C', category: 'languages', level: 70, group: 1 },
    { id: 'cpp', name: 'C++', category: 'languages', level: 75, group: 1 },
    { id: 'css', name: 'CSS', category: 'languages', level: 85, group: 1 },
    { id: 'html', name: 'HTML', category: 'languages', level: 90, group: 1 },
    { id: 'java', name: 'Java', category: 'languages', level: 85, group: 1 },
    { id: 'javascript', name: 'JavaScript', category: 'languages', level: 90, group: 1 },
    { id: 'kotlin', name: 'Kotlin', category: 'languages', level: 80, group: 1 },
    { id: 'latex', name: 'LaTeX', category: 'languages', level: 70, group: 1 },
    { id: 'python', name: 'Python', category: 'languages', level: 95, group: 1 },
    { id: 'r', name: 'R', category: 'languages', level: 65, group: 1 },
    { id: 'racket', name: 'Racket', category: 'languages', level: 60, group: 1 },
    { id: 'sql', name: 'SQL', category: 'languages', level: 85, group: 1 },
    { id: 'scripting', name: 'Scripting', category: 'languages', level: 80, group: 1 },
    { id: 'tsql', name: 'T-SQL', category: 'languages', level: 75, group: 1 },
    { id: 'typescript', name: 'TypeScript', category: 'languages', level: 85, group: 1 },
    
    // AI Knowledge
    { id: 'ai-agents', name: 'AI Agents', category: 'knowledge', level: 85, group: 2 },
    { id: 'computer-vision', name: 'Computer Vision', category: 'knowledge', level: 75, group: 2 },
    { id: 'fine-tuning', name: 'Fine-Tuning', category: 'knowledge', level: 80, group: 2 },
    { id: 'langchain', name: 'Langchain', category: 'knowledge', level: 90, group: 2 },
    { id: 'huggingface', name: 'HuggingFace', category: 'knowledge', level: 85, group: 2 },
    { id: 'neural-nets', name: 'Neural Nets', category: 'knowledge', level: 80, group: 2 },
    { id: 'prompt-engineering', name: 'Prompt Engineering', category: 'knowledge', level: 90, group: 2 },
    { id: 'rag', name: 'RAG', category: 'knowledge', level: 85, group: 2 },
    { id: 'transformer-models', name: 'Transformer Models', category: 'knowledge', level: 80, group: 2 },
    { id: 'vector-embeddings', name: 'Vector Embeddings', category: 'knowledge', level: 85, group: 2 },
    
    // Frameworks
    { id: 'android', name: 'Android', category: 'frameworks', level: 80, group: 3 },
    { id: 'docker-framework', name: 'Docker', category: 'frameworks', level: 85, group: 3 },
    { id: 'flask', name: 'Flask', category: 'frameworks', level: 85, group: 3 },
    { id: 'huggingface-framework', name: 'HuggingFace', category: 'frameworks', level: 85, group: 3 },
    { id: 'hugo', name: 'Hugo', category: 'frameworks', level: 70, group: 3 },
    { id: 'langchain-framework', name: 'Langchain', category: 'frameworks', level: 90, group: 3 },
    { id: 'nextjs', name: 'Next.js', category: 'frameworks', level: 90, group: 3 },
    { id: 'nodejs', name: 'Node.js', category: 'frameworks', level: 85, group: 3 },
    { id: 'reactjs', name: 'React.js', category: 'frameworks', level: 90, group: 3 },
    
    // Database
    { id: 'firebase', name: 'Firebase', category: 'database', level: 85, group: 4 },
    { id: 'mariadb', name: 'MariaDB', category: 'database', level: 75, group: 4 },
    { id: 'mssql', name: 'Microsoft SQL Server', category: 'database', level: 80, group: 4 },
    { id: 'pinecone', name: 'Pinecone', category: 'database', level: 75, group: 4 },
    { id: 'postgresql', name: 'PostgreSQL', category: 'database', level: 85, group: 4 },
    { id: 'redis', name: 'Redis', category: 'database', level: 80, group: 4 },
    { id: 'sqlite', name: 'SQLite', category: 'database', level: 85, group: 4 },
    { id: 'supabase', name: 'Supabase', category: 'database', level: 80, group: 4 },
    
    // Dev
    { id: 'docker-dev', name: 'Docker', category: 'dev', level: 85, group: 5 },
    { id: 'git', name: 'Git', category: 'dev', level: 90, group: 5 },
    { id: 'github-actions', name: 'GitHub Actions', category: 'dev', level: 85, group: 5 },
    { id: 'github-pages', name: 'GitHub Pages', category: 'dev', level: 80, group: 5 },
    
    // Test
    { id: 'acts', name: 'ACTS', category: 'test', level: 70, group: 6 },
    { id: 'googlemock', name: 'GoogleMock', category: 'test', level: 75, group: 6 },
    { id: 'googletest', name: 'GoogleTest', category: 'test', level: 80, group: 6 },
    { id: 'hypothesis', name: 'Hypothesis', category: 'test', level: 75, group: 6 },
    { id: 'junit', name: 'JUnit', category: 'test', level: 85, group: 6 },
    { id: 'libfuzzer', name: 'Libfuzzer', category: 'test', level: 70, group: 6 },
    { id: 'pit', name: 'PIT', category: 'test', level: 70, group: 6 },
    { id: 'pytest', name: 'PyTest', category: 'test', level: 90, group: 6 },
    { id: 'stryker', name: 'Stryker', category: 'test', level: 75, group: 6 },
    
    // Cloud
    { id: 'vercel', name: 'Vercel', category: 'cloud', level: 90, group: 7 },
    { id: 'api-gateways', name: 'API Gateways', category: 'cloud', level: 80, group: 7 },
    { id: 'aws', name: 'AWS', category: 'cloud', level: 85, group: 7 },
    { id: 'cloud-functions', name: 'Cloud Functions', category: 'cloud', level: 85, group: 7 },
    { id: 'cdn', name: 'CDN', category: 'cloud', level: 80, group: 7 },
    { id: 'docker-deployments', name: 'Dockerized Deployments', category: 'cloud', level: 85, group: 7 },
    { id: 'gcp', name: 'GCP', category: 'cloud', level: 90, group: 7 },
    { id: 'load-balancers', name: 'Load Balancers', category: 'cloud', level: 75, group: 7 },
    { id: 'storage-services', name: 'Storage Services', category: 'cloud', level: 85, group: 7 },
    { id: 'virtual-machines', name: 'Virtual Machines', category: 'cloud', level: 80, group: 7 },
    
    // Additional Knowledge
    { id: 'ai-tooling', name: 'AI Tooling', category: 'knowledge', level: 90, group: 8 },
    { id: 'algorithms', name: 'Algorithms & Data-Structures', category: 'knowledge', level: 90, group: 8 },
    { id: 'cloud-knowledge', name: 'Cloud', category: 'knowledge', level: 85, group: 8 },
    { id: 'computer-architecture', name: 'Computer Architecture', category: 'knowledge', level: 80, group: 8 },
    { id: 'databases-knowledge', name: 'Databases', category: 'knowledge', level: 85, group: 8 },
    { id: 'dev-patterns', name: 'Development Patterns', category: 'knowledge', level: 85, group: 8 },
    { id: 'distributed-systems', name: 'Distributed Systems', category: 'knowledge', level: 80, group: 8 },
    { id: 'mobile-dev', name: 'Mobile App Development', category: 'knowledge', level: 80, group: 8 },
    { id: 'networking', name: 'Networking', category: 'knowledge', level: 75, group: 8 },
    { id: 'parallel-processing', name: 'Parallel Processing', category: 'knowledge', level: 75, group: 8 },
    { id: 'shell-scripting', name: 'Shell & Scripting', category: 'knowledge', level: 80, group: 8 },
    { id: 'software-architecture', name: 'Software Architecture', category: 'knowledge', level: 85, group: 8 },
    { id: 'web-dev', name: 'Web Development', category: 'knowledge', level: 90, group: 8 }
  ],
  links: [
    // Language connections
    { source: 'javascript', target: 'typescript' },
    { source: 'javascript', target: 'reactjs' },
    { source: 'javascript', target: 'nodejs' },
    { source: 'typescript', target: 'reactjs' },
    { source: 'typescript', target: 'nextjs' },
    { source: 'html', target: 'css' },
    { source: 'html', target: 'javascript' },
    { source: 'css', target: 'javascript' },
    { source: 'python', target: 'flask' },
    { source: 'python', target: 'pytest' },
    { source: 'python', target: 'langchain' },
    { source: 'python', target: 'huggingface' },
    { source: 'java', target: 'kotlin' },
    { source: 'java', target: 'android' },
    { source: 'java', target: 'junit' },
    { source: 'kotlin', target: 'android' },
    { source: 'c', target: 'cpp' },
    { source: 'cpp', target: 'googletest' },
    { source: 'cpp', target: 'googlemock' },
    { source: 'bash', target: 'scripting' },
    { source: 'bash', target: 'shell-scripting' },
    { source: 'sql', target: 'tsql' },
    { source: 'sql', target: 'postgresql' },
    { source: 'sql', target: 'mariadb' },
    { source: 'sql', target: 'mssql' },
    { source: 'sql', target: 'sqlite' },
    
    // Framework connections
    { source: 'reactjs', target: 'nextjs' },
    { source: 'nodejs', target: 'nextjs' },
    { source: 'flask', target: 'python' },
    { source: 'langchain-framework', target: 'python' },
    { source: 'langchain-framework', target: 'langchain' },
    { source: 'huggingface-framework', target: 'huggingface' },
    { source: 'huggingface-framework', target: 'python' },
    { source: 'android', target: 'java' },
    { source: 'android', target: 'kotlin' },
    { source: 'docker-framework', target: 'docker-dev' },
    { source: 'docker-framework', target: 'docker-deployments' },
    { source: 'hugo', target: 'html' },
    { source: 'hugo', target: 'css' },
    
    // Database connections
    { source: 'postgresql', target: 'sql' },
    { source: 'mariadb', target: 'sql' },
    { source: 'mssql', target: 'tsql' },
    { source: 'sqlite', target: 'sql' },
    { source: 'firebase', target: 'gcp' },
    { source: 'supabase', target: 'postgresql' },
    { source: 'pinecone', target: 'vector-embeddings' },
    { source: 'redis', target: 'databases-knowledge' },
    { source: 'firebase', target: 'cloud-functions' },
    
    // Dev connections
    { source: 'git', target: 'github-actions' },
    { source: 'git', target: 'github-pages' },
    { source: 'docker-dev', target: 'docker-deployments' },
    { source: 'github-actions', target: 'ci-cd' },
    
    // Test connections
    { source: 'pytest', target: 'python' },
    { source: 'junit', target: 'java' },
    { source: 'googletest', target: 'cpp' },
    { source: 'googlemock', target: 'cpp' },
    { source: 'hypothesis', target: 'python' },
    { source: 'acts', target: 'test' },
    { source: 'libfuzzer', target: 'cpp' },
    { source: 'pit', target: 'java' },
    { source: 'stryker', target: 'javascript' },
    
    // Cloud connections
    { source: 'vercel', target: 'nextjs' },
    { source: 'aws', target: 'cloud-knowledge' },
    { source: 'gcp', target: 'cloud-knowledge' },
    { source: 'cloud-functions', target: 'gcp' },
    { source: 'cloud-functions', target: 'aws' },
    { source: 'api-gateways', target: 'cloud-knowledge' },
    { source: 'cdn', target: 'cloud-knowledge' },
    { source: 'docker-deployments', target: 'docker-dev' },
    { source: 'load-balancers', target: 'cloud-knowledge' },
    { source: 'storage-services', target: 'cloud-knowledge' },
    { source: 'virtual-machines', target: 'cloud-knowledge' },
    
    // AI Knowledge connections
    { source: 'ai-agents', target: 'ai-tooling' },
    { source: 'computer-vision', target: 'neural-nets' },
    { source: 'fine-tuning', target: 'transformer-models' },
    { source: 'langchain', target: 'rag' },
    { source: 'langchain', target: 'vector-embeddings' },
    { source: 'huggingface', target: 'transformer-models' },
    { source: 'neural-nets', target: 'ai-tooling' },
    { source: 'prompt-engineering', target: 'ai-tooling' },
    { source: 'rag', target: 'vector-embeddings' },
    { source: 'transformer-models', target: 'neural-nets' },
    { source: 'vector-embeddings', target: 'pinecone' },
    
    // Knowledge connections
    { source: 'algorithms', target: 'computer-architecture' },
    { source: 'cloud-knowledge', target: 'distributed-systems' },
    { source: 'databases-knowledge', target: 'sql' },
    { source: 'dev-patterns', target: 'software-architecture' },
    { source: 'distributed-systems', target: 'networking' },
    { source: 'mobile-dev', target: 'android' },
    { source: 'networking', target: 'distributed-systems' },
    { source: 'parallel-processing', target: 'distributed-systems' },
    { source: 'shell-scripting', target: 'bash' },
    { source: 'software-architecture', target: 'dev-patterns' },
    { source: 'web-dev', target: 'html' },
    { source: 'web-dev', target: 'css' },
    { source: 'web-dev', target: 'javascript' },
    
    // Cross-category connections
    { source: 'python', target: 'ai-tooling' },
    { source: 'javascript', target: 'web-dev' },
    { source: 'typescript', target: 'web-dev' },
    { source: 'nextjs', target: 'vercel' },
    { source: 'flask', target: 'web-dev' },
    { source: 'postgresql', target: 'databases-knowledge' },
    { source: 'docker-dev', target: 'cloud-knowledge' },
    { source: 'github-actions', target: 'cloud-knowledge' },
    { source: 'python', target: 'data-science' },
    { source: 'r', target: 'data-science' },
    { source: 'cpp', target: 'computer-architecture' },
    { source: 'python', target: 'machine-learning' },
    { source: 'neural-nets', target: 'machine-learning' },
    { source: 'transformer-models', target: 'machine-learning' },
    { source: 'android', target: 'mobile-dev' },
    { source: 'reactjs', target: 'web-dev' },
    { source: 'nextjs', target: 'web-dev' },
    { source: 'nodejs', target: 'web-dev' },
    
    // Additional connections for better graph structure
    { source: 'ci-cd', target: 'github-actions' },
    { source: 'ci-cd', target: 'docker-deployments' },
    { source: 'data-science', target: 'machine-learning' },
    { source: 'machine-learning', target: 'ai-tooling' },
    { source: 'test', target: 'dev-patterns' },
    { source: 'web-dev', target: 'vercel' }
  ]
};

// Add missing nodes for connections
skillsData.nodes.push(
  { id: 'ci-cd', name: 'CI/CD', category: 'dev', level: 85, group: 5 },
  { id: 'data-science', name: 'Data Science', category: 'knowledge', level: 80, group: 8 },
  { id: 'machine-learning', name: 'Machine Learning', category: 'knowledge', level: 85, group: 8 },
  { id: 'test', name: 'Testing', category: 'knowledge', level: 85, group: 8 }
);

// Color scheme for different categories
const categoryColors: Record<SkillCategory, string> = {
  languages: '#FF6B6B',
  frameworks: '#4ECDC4',
  database: '#FFEEAD',
  dev: '#96CEB4',
  test: '#D4A5A5',
  cloud: '#88D8B0',
  knowledge: '#9FA8DA'
};

// Constants for graph visualization
const GRAPH_CONFIG = {
  nodeRadius: 40,
  fontSize: 12,
  minFontSize: 9,
  maxWords: 4,
  minLinkDistance: 160,
  maxLinkDistance: 260,
  chargeStrength: -450,
  chargeDistanceMax: 120,
  centerStrength: 0.05,
  collisionStrength: 1.5,
  collisionRadiusOffset: 2.5,
  width: 800,
  height: 600,
  // Add new configuration for improved layout
  initialLayoutIterations: 50,
  spreadFactor: 1.5,
  leafNodeRepulsion: 1.2,
  // Add configuration for component separation
  componentSpacing: 300,
  componentPadding: 100,
};

// Helper function to detect leaf nodes (nodes with only one connection)
const detectLeafNodes = (nodes: SkillNode[], links: SkillLink[]) => {
  // Count connections for each node
  const connectionCounts: Record<string, number> = {};
  
  links.forEach(link => {
    const source = typeof link.source === 'object' ? (link.source as SkillNode).id : link.source as string;
    const target = typeof link.target === 'object' ? (link.target as SkillNode).id : link.target as string;
    
    connectionCounts[source] = (connectionCounts[source] || 0) + 1;
    connectionCounts[target] = (connectionCounts[target] || 0) + 1;
  });
  
  // Mark leaf nodes by directly modifying the original nodes (preserving references)
  nodes.forEach(node => {
    node.isLeaf = (connectionCounts[node.id] || 0) <= 1;
  });
  
  return nodes; // Return the same nodes array with isLeaf property added
};

// Helper function to identify connected components in the graph
const findConnectedComponents = (nodes: SkillNode[], links: SkillLink[]): SkillNode[][] => {
  // Create a map of node id to node index in the nodes array
  const nodeMap: Record<string, number> = {};
  nodes.forEach((node, index) => {
    nodeMap[node.id] = index;
  });
  
  // Create an adjacency list representation of the graph
  const adjacencyList: Record<string, string[]> = {};
  nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });
  
  links.forEach(link => {
    const source = typeof link.source === 'object' ? (link.source as SkillNode).id : link.source as string;
    const target = typeof link.target === 'object' ? (link.target as SkillNode).id : link.target as string;
    
    // Add bidirectional connections (undirected graph)
    if (adjacencyList[source]) adjacencyList[source].push(target);
    if (adjacencyList[target]) adjacencyList[target].push(source);
  });
  
  // Use depth-first search to identify connected components
  const visited: Record<string, boolean> = {};
  const components: SkillNode[][] = [];
  
  const dfs = (nodeId: string, component: SkillNode[]) => {
    visited[nodeId] = true;
    component.push(nodes[nodeMap[nodeId]]);
    
    for (const neighbor of adjacencyList[nodeId] || []) {
      if (!visited[neighbor]) {
        dfs(neighbor, component);
      }
    }
  };
  
  // Find all connected components
  nodes.forEach(node => {
    if (!visited[node.id]) {
      const component: SkillNode[] = [];
      dfs(node.id, component);
      components.push(component);
    }
  });
  
  return components;
};

// Position components using the average-center and radius approach with pure horizontal layout
const positionComponentsWithRadii = (components: SkillNode[][], width: number, height: number) => {
  // Exit if we have 0 or 1 component (no separation needed)
  if (!components || components.length <= 1) return;
  
  // Filter out any invalid components (empty or with invalid nodes)
  const validComponents = components.filter(comp => comp && Array.isArray(comp) && comp.length > 0);
  
  // Sort components by size (node count) in descending order
  validComponents.sort((a, b) => b.length - a.length);
  
  // If no valid components after filtering, exit
  if (validComponents.length <= 1) return;
  
  // Center of the visualization area
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate center and radius for each component
  const componentInfo = validComponents.map(component => {
    // Filter out any invalid nodes
    const validNodes = component.filter(node => node && typeof node === 'object');
    
    if (validNodes.length === 0) {
      return {
        component: validNodes,
        centerX,
        centerY,
        radius: GRAPH_CONFIG.nodeRadius * 3,
        placed: false
      };
    }
    
    // Calculate center (average position)
    let sumX = 0, sumY = 0;
    let nodesWithPosition = 0;
    
    validNodes.forEach(node => {
      if (node && node.x !== undefined && node.y !== undefined) {
        sumX += node.x;
        sumY += node.y;
        nodesWithPosition++;
      }
    });
    
    // Handle edge case of no valid positions
    if (nodesWithPosition === 0) {
      return { 
        component: validNodes, 
        centerX, 
        centerY, 
        radius: GRAPH_CONFIG.nodeRadius * Math.sqrt(validNodes.length) * 2.5,
        placed: false
      };
    }
    
    const avgX = sumX / nodesWithPosition;
    const avgY = sumY / nodesWithPosition;
    
    // Find farthest node to determine radius
    let maxDistance = 0;
    
    validNodes.forEach(node => {
      if (node && node.x !== undefined && node.y !== undefined) {
        const distance = Math.sqrt(
          Math.pow(node.x - avgX, 2) + 
          Math.pow(node.y - avgY, 2)
        );
        maxDistance = Math.max(maxDistance, distance);
      }
    });
    
    // Add node radius to ensure we account for node size
    maxDistance += GRAPH_CONFIG.nodeRadius * 2;
    
    // Calculate radius with some padding, but not too excessive
    const radius = maxDistance * 1.7; // Reduced from 3.0 to 1.7 for tighter spacing
    
    return { 
      component: validNodes, 
      centerX: avgX, 
      centerY: avgY, 
      radius,
      placed: false 
    };
  });
  
  // Filter out any empty component info
  const validComponentInfo = componentInfo.filter(info => info.component.length > 0);
  if (validComponentInfo.length <= 1) return;
  
  // NEW APPROACH: Pure horizontal layout with fixed spacing
  // First, determine the total width needed and adjust spacing accordingly
  const totalComponents = validComponentInfo.length;
  
  // Calculate average component size and determine suitable spacing
  const avgRadius = validComponentInfo.reduce((sum, info) => sum + info.radius, 0) / totalComponents;
  
  // Calculate spacing based on available width and number of components
  // We want to use about 80% of the available width
  const usableWidth = width * 0.8;
  
  // First component is placed at center
  validComponentInfo[0].placed = true;
  
  if (totalComponents > 1) {
    // For 2 components only, place the second one to the right of the first
    if (totalComponents === 2) {
      const info = validComponentInfo[1];
      const spacing = validComponentInfo[0].radius + info.radius + 80; // Small fixed padding
      
      // Place to the right of center
      const newX = centerX + spacing;
      const newY = centerY;
      
      // Move component
      const dx = newX - info.centerX;
      const dy = newY - info.centerY;
      
      info.component.forEach(node => {
        if (node && node.x !== undefined && node.y !== undefined) {
          node.x += dx;
          node.y += dy;
        }
      });
      
      info.centerX = newX;
      info.centerY = newY;
      info.placed = true;
    } 
    // For more than 2 components, use a distributed horizontal layout
    else {
      // Calculate a sensible component spacing based on component count
      // Tighter spacing for more components
      const baseSpacing = Math.min(
        (usableWidth - validComponentInfo[0].radius * 2) / (totalComponents - 1),
        avgRadius * 2.5 // Limit max spacing
      );
      
      // Place components in a line from left to right
      // Center component already placed (at index 0)
      
      // Place left side components
      const leftCount = Math.floor((totalComponents - 1) / 2);
      for (let i = 0; i < leftCount; i++) {
        const info = validComponentInfo[i + 1]; // Skip center component (index 0)
        
        // Calculate position (from center moving left)
        const distance = (i + 1) * baseSpacing;
        const newX = centerX - distance;
        const newY = centerY;
        
        // Move component
        const dx = newX - info.centerX;
        const dy = newY - info.centerY;
        
        info.component.forEach(node => {
          if (node && node.x !== undefined && node.y !== undefined) {
            node.x += dx;
            node.y += dy;
          }
        });
        
        info.centerX = newX;
        info.centerY = newY;
        info.placed = true;
      }
      
      // Place right side components
      for (let i = leftCount; i < totalComponents - 1; i++) {
        const info = validComponentInfo[i + 1]; // Skip center component (index 0)
        
        // Calculate position (from center moving right)
        const distance = (i - leftCount + 1) * baseSpacing;
        const newX = centerX + distance;
        const newY = centerY;
        
        // Move component
        const dx = newX - info.centerX;
        const dy = newY - info.centerY;
        
        info.component.forEach(node => {
          if (node && node.x !== undefined && node.y !== undefined) {
            node.x += dx;
            node.y += dy;
          }
        });
        
        info.centerX = newX;
        info.centerY = newY;
        info.placed = true;
      }
    }
  }
  
  // Check for overlaps and fix them
  let hasOverlaps = true;
  let iterations = 0;
  const maxIterations = 5;
  
  while (hasOverlaps && iterations < maxIterations) {
    hasOverlaps = false;
    iterations++;
    
    // Check each pair of components for overlaps
    for (let i = 0; i < validComponentInfo.length; i++) {
      for (let j = i + 1; j < validComponentInfo.length; j++) {
        const info1 = validComponentInfo[i];
        const info2 = validComponentInfo[j];
        
        // Calculate distance between centers
        const dx = info2.centerX - info1.centerX;
        const dy = info2.centerY - info1.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate minimum non-overlapping distance
        const minDistance = info1.radius + info2.radius + 50; // 50px minimum padding
        
        // If overlapping, adjust positions
        if (distance < minDistance) {
          hasOverlaps = true;
          
          // Move components apart horizontally
          const overlap = minDistance - distance;
          const moveX = (dx / distance) * overlap;
          
          // Move second component away (mostly horizontally)
          info2.component.forEach(node => {
            if (node && node.x !== undefined && node.y !== undefined) {
              node.x += moveX;
            }
          });
          
          info2.centerX += moveX;
        }
      }
    }
  }
  
  // Final adjustment: ensure all components are within view bounds with some padding
  const padding = 40;
  
  // Find leftmost and rightmost component positions
  let minX = Infinity;
  let maxX = -Infinity;
  
  validComponentInfo.forEach(info => {
    const leftEdge = info.centerX - info.radius;
    const rightEdge = info.centerX + info.radius;
    
    minX = Math.min(minX, leftEdge);
    maxX = Math.max(maxX, rightEdge);
  });
  
  // If components extend beyond view, shift everything to center them
  if (minX < padding || maxX > width - padding) {
    const currentWidth = maxX - minX;
    const availableWidth = width - 2 * padding;
    
    // Only adjust if it fits in available width
    if (currentWidth <= availableWidth) {
      const leftShift = minX - padding;
      const rightShift = (width - padding) - maxX;
      const horizontalShift = (rightShift - leftShift) / 2;
      
      // Apply the shift to all components
      validComponentInfo.forEach(info => {
        info.component.forEach(node => {
          if (node && node.x !== undefined) {
            node.x += horizontalShift;
          }
        });
        
        info.centerX += horizontalShift;
      });
    }
  }
};

// Helper function to calculate initial positions in a circular layout
const calculateInitialPositions = (nodes: SkillNode[], width: number, height: number) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0 || !width || !height) return;

  try {
    // First, identify connected components using the current graph data
    const components = findConnectedComponents(nodes, skillsData.links);
    
    // If we have multiple components, first position each component internally
    if (components && components.length > 1) {
      // For each component, layout nodes by category
      components.forEach(component => {
        if (component && Array.isArray(component) && component.length > 0) {
          const componentWidth = width / 2;  // Use scaled dimensions for each component
          const componentHeight = height / 2;
          
          // Position nodes within the component using category-based layout
          positionComponentByCategory(component, componentWidth, componentHeight);
        }
      });
      
      // Then position components relative to each other
      positionComponentsWithRadii(components, width, height);
      return;
    }
    
    // For a single component, use the standard layout
    positionComponentByCategory(nodes, width, height);
  } catch (error) {
    console.error("Error in calculateInitialPositions:", error);
  }
};

// Helper to position nodes within a component by category
const positionComponentByCategory = (nodes: SkillNode[], width: number, height: number) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0 || !width || !height) return;
  
  try {
    // Filter out invalid nodes
    const validNodes = nodes.filter(node => node && typeof node === 'object');
    if (validNodes.length === 0) return;
    
    // Group nodes by category
    const nodesByCategory: Record<string, SkillNode[]> = {};
    
    validNodes.forEach(node => {
      if (!node || typeof node !== 'object') return;
      
      // Ensure the node has a category
      const category = (node.category || 'unknown') as string;
      
      if (!nodesByCategory[category]) {
        nodesByCategory[category] = [];
      }
      nodesByCategory[category].push(node);
    });
    
    // Calculate positions for each category in a circular arrangement
    const categories = Object.keys(nodesByCategory);
    if (categories.length === 0) return;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35; // Use 35% of the smallest dimension
    
    categories.forEach((category, categoryIndex) => {
      const categoryNodes = nodesByCategory[category];
      if (!categoryNodes || categoryNodes.length === 0) return;
      
      const categoryAngle = (2 * Math.PI * categoryIndex) / categories.length;
      
      // Position the category nodes in a sub-circle
      categoryNodes.forEach((node, nodeIndex) => {
        if (!node) return;
        
        const subCircleRadius = radius * 0.5; // Smaller radius for the category sub-circle
        const nodeAngle = categoryAngle + ((2 * Math.PI * nodeIndex) / categoryNodes.length) * 0.5;
        
        // Position relative to category center
        const categoryX = centerX + radius * Math.cos(categoryAngle);
        const categoryY = centerY + radius * Math.sin(categoryAngle);
        
        // Use a deterministic offset instead of random jitter to avoid hydration errors
        const offset = ((nodeIndex % 5) - 2) * 3; // Values between -6 and 6
        
        // Modify the node position preserving its reference
        node.x = categoryX + subCircleRadius * Math.cos(nodeAngle) + offset;
        node.y = categoryY + subCircleRadius * Math.sin(nodeAngle) + offset;
        
        // For leaf nodes (nodes with only one connection), position them further outward
        if (node.isLeaf) {
          node.x = categoryX + (subCircleRadius * GRAPH_CONFIG.spreadFactor) * Math.cos(nodeAngle);
          node.y = categoryY + (subCircleRadius * GRAPH_CONFIG.spreadFactor) * Math.sin(nodeAngle);
        }
      });
    });
  } catch (error) {
    console.error("Error in positionComponentByCategory:", error);
  }
};

const SkillGraph = () => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [mounted, setMounted] = useState(false);
  const [graphData, setGraphData] = useState(skillsData);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGraphReady, setIsGraphReady] = useState(false);
  const { theme, systemTheme } = useTheme();
  
  // Use a simple any type for the ref to avoid complex typing issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to reset graph position based on node positions
  const resetGraphPosition = useCallback(() => {
    if (!graphRef.current || !graphData.nodes.length) return;
    
    // Use the graph's built-in zoomToFit method which centers based on actual node positions
    graphRef.current.zoomToFit(400, 50);
  }, [graphData.nodes]);

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
        
        // Only update dimensions if they've actually changed
        setDimensions(prevDimensions => {
          if (prevDimensions.width !== width || prevDimensions.height !== height) {
            return { width, height };
          }
          return prevDimensions;
        });
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

  // Separate effect for handling graph position on resize
  useEffect(() => {
    if (!isGraphReady || !graphRef.current || !dimensions.width) return;
    
    // Reset graph position when dimensions change
    const timer = setTimeout(() => {
      resetGraphPosition();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [dimensions, isGraphReady, resetGraphPosition]);

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
      // Detect leaf nodes on a copy of the original data
      const processedNodes = detectLeafNodes([...skillsData.nodes], skillsData.links);
      
      setGraphData({
        nodes: processedNodes,
        links: skillsData.links
      });
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

      // Detect leaf nodes on our filtered set
      const processedNodes = detectLeafNodes([...relevantNodes], relevantLinks);

      setGraphData({
        nodes: processedNodes,
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
      ?.radius((node: NodeObject) => {
        // Increase collision radius for leaf nodes to push them outward
        const nodeWithLeaf = node as SkillNode;
        return GRAPH_CONFIG.nodeRadius * (1 + GRAPH_CONFIG.collisionRadiusOffset) * 
               (nodeWithLeaf.isLeaf ? GRAPH_CONFIG.leafNodeRepulsion : 1);
      });

    // First, detect and tag leaf nodes
    detectLeafNodes(graphData.nodes, graphData.links);

    // Set initial node positions to minimize overlaps
    if (graphData.nodes.length > 0 && dimensions.width > 0 && dimensions.height > 0) {
      // Apply initial layout - now with improved component separation
      setTimeout(() => {
        try {
          calculateInitialPositions(graphData.nodes, dimensions.width, dimensions.height);
          fg.d3ReheatSimulation(); // Reheat after setting positions
        } catch (error) {
          console.error("Error calculating initial positions:", error);
        }
      }, 100);
    }

    // Add a custom force to minimize link crossings
    // This creates a repulsive force between links that would otherwise cross
    const simulation = fg.d3Force('simulation');
    if (simulation) {
      const linkCrossingMinimizationForce = () => {
        // For each pair of links, calculate if they might cross and apply a small force
        // to reduce crossing likelihood
        const links = graphData.links;
        
        // Limit the number of link pairs we check to avoid performance issues
        const maxPairsToCheck = 1000;
        let pairsChecked = 0;
        
        for (let i = 0; i < links.length && pairsChecked < maxPairsToCheck; i++) {
          for (let j = i + 1; j < links.length && pairsChecked < maxPairsToCheck; j++) {
            pairsChecked++;
            
            const link1 = links[i];
            const link2 = links[j];
            
            // Get source and target nodes for both links
            const source1 = typeof link1.source === 'object' ? link1.source : null;
            const target1 = typeof link1.target === 'object' ? link1.target : null;
            const source2 = typeof link2.source === 'object' ? link2.source : null;
            const target2 = typeof link2.target === 'object' ? link2.target : null;
            
            if (!source1 || !target1 || !source2 || !target2) continue;
            
            // Skip if the links share a node (can't cross in that case)
            if (source1 === source2 || source1 === target2 || 
                target1 === source2 || target1 === target2) {
              continue;
            }
            
            // Very simple heuristic for potential crossing:
            // If the bounding boxes of the links overlap, apply a small force
            const s1x = (source1 as NodeObject).x || 0;
            const s1y = (source1 as NodeObject).y || 0;
            const t1x = (target1 as NodeObject).x || 0;
            const t1y = (target1 as NodeObject).y || 0;
            
            const s2x = (source2 as NodeObject).x || 0;
            const s2y = (source2 as NodeObject).y || 0;
            const t2x = (target2 as NodeObject).x || 0;
            const t2y = (target2 as NodeObject).y || 0;
            
            // Calculate bounding boxes
            const box1 = {
              minX: Math.min(s1x, t1x),
              maxX: Math.max(s1x, t1x),
              minY: Math.min(s1y, t1y),
              maxY: Math.max(s1y, t1y)
            };
            
            const box2 = {
              minX: Math.min(s2x, t2x),
              maxX: Math.max(s2x, t2x),
              minY: Math.min(s2y, t2y),
              maxY: Math.max(s2y, t2y)
            };
            
            // Check for overlap in bounding boxes
            if (box1.minX <= box2.maxX && box1.maxX >= box2.minX &&
                box1.minY <= box2.maxY && box1.maxY >= box2.minY) {
              
              // Apply small repulsive forces to nodes to reduce likelihood of crossing
              const forceStrength = 0.02; // Reduced from 0.05
              
              // Calculate midpoints of links
              const mid1x = (s1x + t1x) / 2;
              const mid1y = (s1y + t1y) / 2;
              const mid2x = (s2x + t2x) / 2;
              const mid2y = (s2y + t2y) / 2;
              
              // Direction vector between midpoints
              const dx = mid2x - mid1x;
              const dy = mid2y - mid1y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              
              // Normalize and apply force
              const fx = (dx / dist) * forceStrength;
              const fy = (dy / dist) * forceStrength;
              
              // Apply forces to node velocities (more gently)
              // Use proper type casting to NodeObjectWithVelocity for nodes with vx/vy
              interface NodeObjectWithVelocity extends NodeObject {
                vx?: number;
                vy?: number;
              }
              
              const s1WithVelocity = source1 as NodeObjectWithVelocity;
              const t1WithVelocity = target1 as NodeObjectWithVelocity;
              const s2WithVelocity = source2 as NodeObjectWithVelocity;
              const t2WithVelocity = target2 as NodeObjectWithVelocity;
              
              if (s1WithVelocity.vx !== undefined) s1WithVelocity.vx -= fx;
              if (s1WithVelocity.vy !== undefined) s1WithVelocity.vy -= fy;
              if (t1WithVelocity.vx !== undefined) t1WithVelocity.vx -= fx;
              if (t1WithVelocity.vy !== undefined) t1WithVelocity.vy -= fy;
              
              if (s2WithVelocity.vx !== undefined) s2WithVelocity.vx += fx;
              if (s2WithVelocity.vy !== undefined) s2WithVelocity.vy += fy;
              // Apply force to t2WithVelocity
              if (t2WithVelocity.vx !== undefined) t2WithVelocity.vx += fx;
              if (t2WithVelocity.vy !== undefined) t2WithVelocity.vy += fy;
            }
          }
        }
      };
      
      // Register the custom force
      simulation.force('minimizeCrossings', linkCrossingMinimizationForce);
    }

    // Center the graph after positioning
    setTimeout(() => {
      resetGraphPosition();
    }, 600);
    
  }, [mounted, graphData, dimensions, isInitialized, calculateLinkDistance, resetGraphPosition]);

  const handleNodeClick = useCallback((node: NodeObject) => {
    // We can reuse node.x and node.y directly without creating a skillNode variable
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
    }
  }, []);

  // Function to get the appropriate outline color based on theme
  const getOutlineColor = useCallback(() => {
    // Check if component is mounted to avoid hydration issues
    if (!mounted) return 'rgba(0, 0, 0, 0.2)';
    
    // Determine current theme
    const currentTheme = theme === 'system' ? systemTheme : theme;
    
    // Return appropriate color based on theme
    return currentTheme === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' // Light color for dark mode
      : 'rgba(0, 0, 0, 0.2)';      // Dark color for light mode
  }, [theme, systemTheme, mounted]);

  // Add an effect to update colors when theme changes or component mounts
  useEffect(() => {
    // Reference to the current graph instance
    const currentGraph = graphRef.current;
    
    // Update outline color based on theme
    const updateOutlineColor = () => {
      if (!currentGraph) return;
      
      // Reheat simulation when theme changes
      currentGraph.d3ReheatSimulation();
    };
    
    // Initial update
    updateOutlineColor();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          updateOutlineColor();
        }
      });
    });

    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => observer.disconnect();
  }, [mounted, isInitialized, theme, systemTheme]);

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
            nodeCanvasObject={(node, ctx) => {
              const skillNode = node as SkillNode;
              const label = skillNode.name;
              
              // Calculate node radius based on skill level
              const levelFactor = skillNode.level / 100; // Convert level to 0-1 scale
              const nodeR = GRAPH_CONFIG.nodeRadius * (0.8 + (levelFactor * 0.4)); // Scale between 80% and 120% of base radius
              
              // Draw node circle with border
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, nodeR, 0, 2 * Math.PI, false);
              ctx.fillStyle = categoryColors[skillNode.category];
              ctx.fill();
              ctx.strokeStyle = getOutlineColor();
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Calculate appropriate font size based on text length and node size
              const words = label.split(' ');
              const longestWordLength = Math.max(...words.map(word => word.length));
              const totalLength = label.length;
              
              // Scale font size based on text length and node size
              let fontSize = GRAPH_CONFIG.fontSize;
              
              // Reduce font size for long words or many words
              if (longestWordLength > 10 || words.length > GRAPH_CONFIG.maxWords) {
                fontSize = Math.max(GRAPH_CONFIG.minFontSize, fontSize - 2);
              }
              
              // Further reduce for very long total text
              if (totalLength > 20) {
                fontSize = Math.max(GRAPH_CONFIG.minFontSize, fontSize - 1);
              }
              
              // Draw label with black text for better readability against colored backgrounds
              ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000000'; // Always black for better contrast
              
              // Handle multi-word labels with improved spacing
              if (words.length > 1) {
                const lineHeight = fontSize + 2;
                const totalHeight = lineHeight * words.length;
                const startY = node.y! - (totalHeight / 2) + (lineHeight / 2);
                
                words.forEach((word, i) => {
                  // For very long words, truncate with ellipsis if needed
                  let displayWord = word;
                  const maxWordLength = Math.floor(nodeR * 1.5);
                  if (word.length > maxWordLength) {
                    displayWord = word.substring(0, maxWordLength - 2) + '..';
                  }
                  
                  ctx.fillText(displayWord, node.x!, startY + i * lineHeight);
                });
              } else {
                // For single words, just center them
                // Truncate very long single words if needed
                let displayLabel = label;
                const maxLabelLength = Math.floor(nodeR * 1.8);
                if (label.length > maxLabelLength) {
                  displayLabel = label.substring(0, maxLabelLength - 2) + '..';
                }
                
                ctx.fillText(displayLabel, node.x!, node.y!);
              }
            }}
            nodeRelSize={GRAPH_CONFIG.nodeRadius}
            linkWidth={2}
            linkColor={() => getOutlineColor()}
            onNodeClick={handleNodeClick}
            cooldownTicks={100}
            d3VelocityDecay={0.2}
            warmupTicks={GRAPH_CONFIG.initialLayoutIterations}
            onEngineStop={() => {
              // Ensure graph is visible when simulation stops
              if (!isGraphReady) {
                resetGraphPosition();
                setIsGraphReady(true);
              }
            }}
          />
        )}
      </div>

      {/* Buttons overlay - now after graph in DOM */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 12.46 22 3"/>
            </svg>
            <span>Click on a category to filter the skill graph, zoom in and out by scrolling, or grab a node and drag it around!</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(categoryColors) as SkillCategory[]).map((category) => (
              <button
                key={category}
                style={{
                  backgroundColor: selectedCategory === category ? categoryColors[category] : `${categoryColors[category]}33`,
                  color: selectedCategory === category ? '#000000' : 'inherit',
                  border: `2px solid ${categoryColors[category]}`
                }}
                className="px-3 py-1 rounded-full text-sm font-medium transition-all hover:bg-opacity-80 hover:scale-105 relative group"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {selectedCategory !== category && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    +
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          {selectedCategory && (
            <button
              className="px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={() => setSelectedCategory(null)}
            >
              Clear
            </button>
          )}
          <button
            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            onClick={resetGraphPosition}
            title="Center Graph"
          >
            Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillGraph; 