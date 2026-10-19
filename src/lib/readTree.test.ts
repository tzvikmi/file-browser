import { describe, expect, it } from 'vitest';
import { readDirectory, sortNodes } from './readTree';
import type { FsNode } from './types';

function fileHandle(name: string): FileSystemFileHandle {
  return { kind: 'file', name } as unknown as FileSystemFileHandle;
}

function dirHandle(name: string, entries: FileSystemHandle[] = []): FileSystemDirectoryHandle {
  return {
    kind: 'directory',
    name,
    async *values() {
      for (const entry of entries) yield entry;
    },
  } as unknown as FileSystemDirectoryHandle;
}

describe('sortNodes', () => {
  it('puts directories before files, each sorted naturally', () => {
    const nodes: FsNode[] = [
      { kind: 'file', name: 'b.txt', path: 'b.txt', handle: fileHandle('b.txt') },
      { kind: 'file', name: 'a.txt', path: 'a.txt', handle: fileHandle('a.txt') },
      { kind: 'directory', name: 'zed', path: 'zed', handle: dirHandle('zed') },
      { kind: 'directory', name: 'alpha', path: 'alpha', handle: dirHandle('alpha') },
    ];
    expect(sortNodes(nodes).map((n) => n.name)).toEqual([
      'alpha',
      'zed',
      'a.txt',
      'b.txt',
    ]);
  });

  it('sorts numerically (10 after 2)', () => {
    const nodes: FsNode[] = [
      { kind: 'file', name: 'img10.png', path: '10', handle: fileHandle('img10.png') },
      { kind: 'file', name: 'img2.png', path: '2', handle: fileHandle('img2.png') },
    ];
    expect(sortNodes(nodes).map((n) => n.name)).toEqual(['img2.png', 'img10.png']);
  });
});

describe('readDirectory', () => {
  it('builds sorted nodes with correct kinds and paths', async () => {
    const root = dirHandle('root', [
      fileHandle('readme.md'),
      dirHandle('src'),
    ]);

    const nodes = await readDirectory(root, 'project');

    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toMatchObject({
      kind: 'directory',
      name: 'src',
      path: 'project/src',
    });
    expect(nodes[1]).toMatchObject({
      kind: 'file',
      name: 'readme.md',
      path: 'project/readme.md',
    });
  });

  it('uses the bare name as path at the root level', async () => {
    const root = dirHandle('root', [fileHandle('a.txt')]);
    const nodes = await readDirectory(root);
    expect(nodes[0].path).toBe('a.txt');
  });
});
