# File Explorer

A browser-only, read-only file explorer. Pick a folder from your machine, browse
it as a Finder-style tree, and inspect file metadata — including image
dimensions, EXIF, and a preview — in a detail pane.

Everything runs in the browser. **No server, no network calls, no persistence,
and folder access is strictly read-only.**

## Requirements

A Chromium-based browser (Chrome, Edge, Brave). The app uses the
[File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)
(`showDirectoryPicker`), which Firefox and Safari do not yet support — in those
browsers the app shows a clear notice instead.

## Getting started

```bash
npm install
npm run dev      # start the dev server
```

Open the printed URL, click **Pick a folder…**, and choose a directory.

## The `check` command

A single gate runs after every change:

```bash
npm run check    # typecheck + lint + tests
```

It runs, in order:

- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run test` — Vitest (run once)

## Project rules

These invariants hold for every feature:

- **Framework-free core.** Everything under `src/lib/` is pure TypeScript and
  never imports React.
- **No network, no storage, no writes.** No `fetch`, no `localStorage` /
  `IndexedDB`, and read-only folder access.
- **One tokens file.** All design tokens are CSS variables in
  `src/styles/tokens.css`; component styles only reference those variables.

## Structure

```
src/
  lib/            framework-free core (types, formatting, FS access, image meta)
  hooks/          React hooks (file-details loading + object-URL lifecycle)
  components/     UI (tree, detail pane, image details, empty state)
  styles/         tokens.css (the single tokens file) + global base styles
  App.tsx         app shell: pick folder → tree + detail layout
```
