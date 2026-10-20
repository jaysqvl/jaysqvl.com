# Temporary development-tool risk acceptance

Owner `jaysqvl` explicitly accepted **GHSA-vfj7-8cjw-p6xm** on 2026-10-20.
It remains **unpatched**, not fixed or dismissed. The acceptance expires at
**2026-11-19 12:49:28 UTC (04:49:28 America/Vancouver)**; it does not renew itself.

The reviewed chain is `eslint-config-next@16.4.2` →
`@next/eslint-plugin-next@16.4.2` → `fast-glob@3.3.1` →
`micromatch@4.0.8` → `braces@3.0.3`. All five entries are development-only.
The advisory concerns denial of service from deeply nested glob patterns.
The Next ESLint root-directory glob caller is local lint tooling; this repository
does not configure `settings.next.rootDir`, or pass visitor input to that caller.
This is a bounded exposure assessment, not a claim that Vercel hosting prevents
framework vulnerabilities or that untrusted repository contributions are safe.

Keep official upstream packages. Do not introduce a fork, force a breaking
downgrade, disable lint rules, or claim that this exception repairs `braces`.

CI independently runs `npm audit --omit=dev --audit-level=low` without exceptions.
`npm run audit:dependencies` prints the full audit and accepts only the exact
advisory and propagation chain above, while its expiry, lockfile versions,
registry URLs, integrity hashes, development flags, paths, edges, and ESLint
configuration match the reviewed snapshot. Any other finding, audit error,
changed exposure, or expired acceptance fails. Tests exercise these failure cases.

When a supported official fix becomes available, update the normal dependency
and lockfile, run the full checks, and remove this acceptance and its specialized
gate in favor of plain `npm audit --audit-level=low`. A clean audit already passes
without using the exception, including after expiry. Extending or broadening the
acceptance requires another explicit owner decision; do not change the clock or
dates to manufacture a passing result.
