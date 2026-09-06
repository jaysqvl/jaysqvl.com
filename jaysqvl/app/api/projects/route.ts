import { getGithubProjects } from '@/lib/github-projects';

// Keep the response dynamic while the individual GitHub fetches cache successes
// for an hour. A failed refresh must be retried on the next visit.
export const revalidate = 0;

export async function GET() {
  const result = await getGithubProjects();
  return Response.json(result, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
