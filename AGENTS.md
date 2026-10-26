<!-- bmad:context -->
<!-- Verified 2026-10-26 against d1cfb5a. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## file-browser

Browser-only, read-only file explorer: pick a folder via the File System Access API, browse a tree, inspect metadata and previews. React 18, TypeScript, Vite, Vitest. Chromium only.

## Policy

- Keep `src/lib/` framework-free: never import React or any UI library there. UI code goes in `src/components/` or `src/hooks/`.
- No network and no writes: never add `fetch`, `XMLHttpRequest`, `localStorage`, `IndexedDB`, or any write/`readwrite` folder access. Folder access stays read-only.
- Do not extend `src/lib/corruptCache.ts` or copy its `localStorage` use. It violates the rule above and is slated for removal.
- Style only through CSS variables defined in `src/styles/tokens.css`; never hardcode colors, spacing, or fonts in component styles. Add a new token there instead.
- Leave `npm run check` green after every change.

## Where things are

- Entry points: `src/main.tsx`, `src/App.tsx`. Pure core in `src/lib/`, loading hook in `src/hooks/useFileDetails.ts`.

<!-- /bmad:context -->
