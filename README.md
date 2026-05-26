# jaysqvl.com

Personal portfolio for Jay Esquivel Jr., built with Next.js, TypeScript, Tailwind CSS, and Vercel.

The current redesign direction is a quieter black-and-white portfolio with warm neutrals, restrained pastel accents, static homelab notes, selected projects, resume-style work history, and direct contact links.

## App

The Next.js app lives in `jaysqvl/`.

```bash
cd jaysqvl
npm install
npm run dev
```

## Checks

```bash
cd jaysqvl
npm run lint
npm run build
```

## Deployment

Production stays on `main`. Redesign work happens on `redesign/homelab-neutral` and should be reviewed through Vercel preview deployments before merge.

The pre-redesign safety tag is `pre-redesign-2026-05-26`. See `RELEASE.md` for the release and rollback runbook.
