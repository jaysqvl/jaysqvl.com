# jaysqvl portfolio app

Next.js app for `jaysqvl.com`.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm test
npm run build
```

The production site deploys from `main`; feature branches are reviewed through Vercel previews before merging.

## Project cards

Edit `lib/projects.ts` to select public repositories, set their display order, and write their descriptions. This order stays fixed after refreshes.

Near the Projects section, the browser loads `/api/projects` to refresh language tags and GitHub's last-push timestamps. Successful GitHub requests are cached for one hour; a validated browser snapshot provides metadata during outages. Cached data cannot replace the current project selection, copy, or links.

“Last push” reports repository activity, including dependency updates and fork syncs. It is not the date of the latest authored feature or release. An optional `releases` link points to that project's GitHub Releases page.
