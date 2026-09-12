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

## Logo assets

The frame controls corner rounding; `LogoOrIcon` fills it without a circular mask. Its `sizes` prop should match the frame's CSS width so Next.js requests enough pixels for high-density screens. Preserve built-in logo spacing; use `fit="contain"` for the transparent personal brand mark.

- `public/logos/2k.svg`: unchanged [official 2K navigation asset](https://assets.2k.com/1a6ngf98576c/2zjPZpinUk7HU9ppHrQaWd/e51ed9ba96d3eab501f5d751248ad72f/2K_Web_App_config_Nav_Logo_30x30.svg).
- `public/logos/sfu-square.png`: unchanged 350px [Square SFU avatar](https://www.sfu.ca/content/sfu/communicators-toolkit/brand/templates/social-media/_jcr_content/main_content/image_1573110299.img.original.low.png/1687474210243.png) from SFU's [official social-media templates](https://www.sfu.ca/communicators-toolkit/brand/templates/social-media.html).
- Existing square OffroadExpert and UBC crest images are retained.
