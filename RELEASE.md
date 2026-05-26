# Release and rollback runbook

This repo keeps production on `main` and uses branch/PR previews for redesign work.

## Current safety checkpoint

- Snapshot tag: `pre-redesign-2026-05-26`
- Snapshot commit: `8354600a9a119004571516be8a83b490e95ae566`
- Redesign branch: `redesign/homelab-neutral`
- App root for Vercel: `jaysqvl/`

## Redesign workflow

1. Keep all redesign work on `redesign/homelab-neutral`.
2. Push each reviewable change to the branch and use the Vercel preview deployment from the PR.
3. Before merging, run:

   ```bash
   cd jaysqvl
   npm run build
   ```

4. Verify the preview on desktop and mobile.
5. Check the main public links: resume PDF, GitHub, LinkedIn, email/contact, and project links.
6. Merge the PR into `main` only when the preview is the version intended for production.
7. After production is confirmed, tag the shipped redesign:

   ```bash
   git tag -a portfolio-v2-homelab-neutral -m "Portfolio v2 homelab-neutral redesign"
   git push origin portfolio-v2-homelab-neutral
   ```

## Rollback options

- Fastest: use Vercel rollback to restore the previous production deployment.
- Git-clean: revert the redesign merge commit on `main` and let Vercel redeploy.
- Historical restore: branch from `pre-redesign-2026-05-26` to recover the exact pre-redesign source.

## Content guardrails

- Do not add private homelab telemetry, live uptime data, hostnames, IPs, or internal network details.
- Homelab content should stay static and high-level: UniFi, OPNsense, Docker, Raspberry Pi DNS, automation scripts, cloud migrations, and tooling.
