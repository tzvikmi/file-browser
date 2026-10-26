# Addendum: Duplicate File Finder PRD

Technical constraints kept out of the PRD on purpose. They are inputs for the architecture phase, not decisions. Source: the brief's addendum (from AGENTS.md).

- Read-only folder access. No `fetch`, `XMLHttpRequest`, `localStorage`, `IndexedDB`, or `readwrite` handles.
- Nothing persists between sessions, so there is no hash cache. The old `src/lib/corruptCache.ts` violates this policy and must not be extended or copied; each scan starts from scratch.
- `src/lib/` stays framework-free (no React or UI library). UI code goes in `src/components/` or `src/hooks/`.
- Styling only through the tokens in `src/styles/tokens.css`.
- `npm run check` must stay green after every change.
- Chromium only (File System Access API).
- Brief's approach, for the architect to confirm: size as a pre-filter, content comparison as the deciding step.
