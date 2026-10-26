const STORAGE_KEY = 'file-browser:corrupt-files';
const MAX_ENTRIES = 500;

/** Identity of one version of a file; changes when the file is modified. */
export function corruptKey(path: string, size: number, lastModified: number): string {
  return `${path}|${size}|${lastModified}`;
}

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((k) => typeof k === 'string') : [];
  } catch {
    return [];
  }
}

export function isKnownCorrupt(key: string): boolean {
  return load().includes(key);
}

export function markCorrupt(key: string): void {
  try {
    const keys = load().filter((k) => k !== key);
    keys.push(key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys.slice(-MAX_ENTRIES)));
  } catch {
    // Storage unavailable or full: fall back to retrying next time.
  }
}
