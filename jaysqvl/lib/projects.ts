export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  languages: string[];
  github: string;
  demo?: string;
  updatedAt: string | null;
  type?: string;
}

export const githubOwner = 'jaysqvl';

// These are the projects selected for the homepage. They also remain available
// before the lazy refresh, or if GitHub is unavailable.
export const fallbackProjects: ProjectItem[] = [
  {
    id: 'jaysqvl/buntzen-pass-bot',
    title: 'Buntzen Pass Bot',
    type: 'Browser automation',
    description:
      'I built this to help my family reserve Buntzen Lake park passes when bookings open. It automates the reservation process in a browser.',
    languages: ['Go'],
    github: 'https://github.com/jaysqvl/buntzen-pass-bot',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/wifi-qrcode-generator',
    title: 'Wi-Fi QR Generator',
    type: 'Homelab utility',
    description:
      'A command-line tool that creates Wi-Fi QR codes so guests can join a network without typing the password. Exports PNG and SVG files.',
    languages: ['Shell'],
    github: 'https://github.com/jaysqvl/wifi-qrcode-generator',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/expensai',
    title: 'ExpensAI',
    type: 'Android app',
    description:
      'Expense tracking app with receipt scanning, Firebase-backed sync, OpenAI Vision classification, and cloud functions for image/text processing.',
    languages: ['Kotlin'],
    github: 'https://github.com/jaysqvl/ExpensAI',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/impersonator',
    title: 'Impersonator',
    type: 'Document chatbot',
    description:
      'PDF-grounded chatbot using LangChain, vector stores, Docker, and a Streamlit interface for querying document collections.',
    languages: ['Python'],
    github: 'https://github.com/jaysqvl/impersonator',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/snapscreen.ai',
    title: 'SnapScreen.ai',
    type: 'Resume screening platform',
    description:
      'A prototype for student hiring, with authentication and a résumé review dashboard. Still in development.',
    languages: ['Java'],
    github: 'https://github.com/jaysqvl/snapscreen.ai',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/divide-and-conquer-socket-program',
    title: 'Divide and Conquer',
    type: 'Networked game',
    description:
      'Java socket-based multiplayer drawing/territory game with a multithreaded server and packet-based client communication.',
    languages: ['Java'],
    github: 'https://github.com/jaysqvl/divide-and-conquer-socket-program',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/jaysqvl.com',
    title: 'Jaysqvl.com',
    type: 'Personal website',
    description:
      'The source for this website, built with Next.js and hosted on Vercel.',
    languages: ['TypeScript'],
    github: 'https://github.com/jaysqvl/jaysqvl.com',
    demo: 'https://jaysqvl.com',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/cardiolo',
    title: 'Cardiolo',
    type: 'Mobile activity tracking',
    description:
      'An Android app that records exercise routes and classifies activities.',
    languages: ['Kotlin'],
    github: 'https://github.com/jaysqvl/Cardiolo',
    updatedAt: null,
  },
];

function isText(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function isDemoUrl(value: unknown): boolean {
  if (!isText(value, 2048)) return false;

  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
  } catch {
    return false;
  }
}

// Browser storage and API responses are untrusted. Keep the public card contract
// small and reject unexpected destinations before rendering links.
export function isProjectList(value: unknown): value is ProjectItem[] {
  if (!Array.isArray(value) || value.length > 50) return false;

  const ids = new Set<string>();
  return value.every((item: unknown) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    const project = item as Record<string, unknown>;

    if (
      !isText(project.id, 140) ||
      !/^jaysqvl\/[a-z0-9._-]+$/.test(project.id) ||
      ids.has(project.id) ||
      !isText(project.title, 128) ||
      !isText(project.description, 2048) ||
      !isText(project.github, 256) ||
      !/^https:\/\/github\.com\/jaysqvl\/[a-zA-Z0-9._-]+$/.test(project.github) ||
      project.github.slice('https://github.com/'.length).toLowerCase() !== project.id ||
      !Array.isArray(project.languages) ||
      project.languages.length > 5 ||
      !project.languages.every((language) => isText(language, 80)) ||
      (project.type !== undefined && !isText(project.type, 128)) ||
      (project.demo !== undefined && !isDemoUrl(project.demo)) ||
      (project.updatedAt !== null && (
        !isText(project.updatedAt, 40) ||
        !/^\d{4}-\d{2}-\d{2}T/.test(project.updatedAt) ||
        !Number.isFinite(Date.parse(project.updatedAt))
      ))
    ) return false;

    ids.add(project.id);
    return true;
  });
}
