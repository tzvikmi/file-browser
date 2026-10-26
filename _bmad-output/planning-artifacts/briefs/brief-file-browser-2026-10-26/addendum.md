# Addendum: Duplicate File Finder

Constraint notes for downstream documents (PRD, architecture). These are inputs, not decisions.

## Project constraints (from AGENTS.md)
- Read-only folder access; no `fetch`, `XMLHttpRequest`, `localStorage`, `IndexedDB`, or `readwrite` handles.
- `src/lib/` must stay framework-free (no React or UI library). UI goes in `src/components/` or `src/hooks/`.
- `src/lib/corruptCache.ts` uses `localStorage`, violates the policy, and must not be extended or copied. So there is no persistent hash cache; each scan starts from scratch.
- Styling only through tokens in `src/styles/tokens.css`.
- `npm run check` must stay green.
- Chromium only (File System Access API).
