import type { FsNode } from './types';

/**
 * Sorts nodes Finder-style: directories first, then by name using a
 * natural, case-insensitive comparison.
 */
export function sortNodes(nodes: FsNode[]): FsNode[] {
  return [...nodes].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
}

/**
 * Reads a single directory level (no recursion). Children are discovered
 * lazily as the user expands folders, keeping large trees responsive.
 */
export async function readDirectory(
  dir: FileSystemDirectoryHandle,
  parentPath = '',
): Promise<FsNode[]> {
  const nodes: FsNode[] = [];
  for await (const entry of dir.values()) {
    const path = parentPath ? `${parentPath}/${entry.name}` : entry.name;
    if (entry.kind === 'directory') {
      nodes.push({
        kind: 'directory',
        name: entry.name,
        path,
        handle: entry as FileSystemDirectoryHandle,
      });
    } else {
      nodes.push({
        kind: 'file',
        name: entry.name,
        path,
        handle: entry as FileSystemFileHandle,
      });
    }
  }
  return sortNodes(nodes);
}
