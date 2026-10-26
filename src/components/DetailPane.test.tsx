import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DetailPane } from './DetailPane';
import type { FileNode } from '../lib/types';

function textFileNode(): FileNode {
  const file = new File(['hello world'], 'note.txt', {
    type: 'text/plain',
    lastModified: 1_700_000_000_000,
  });
  const handle = {
    kind: 'file',
    name: 'note.txt',
    getFile: async () => file,
  } as unknown as FileSystemFileHandle;
  return { kind: 'file', name: 'note.txt', path: 'note.txt', handle };
}

function nodeOf(name: string, parts: BlobPart[], type = ''): FileNode {
  const file = new File(parts, name, { type, lastModified: 1_700_000_000_000 });
  const handle = { kind: 'file', name, getFile: async () => file } as unknown as FileSystemFileHandle;
  return { kind: 'file', name, path: `dir/${name}`, handle };
}

describe('DetailPane text preview', () => {
  beforeEach(() => localStorage.clear());

  it('shows text content', async () => {
    render(<DetailPane selected={textFileNode()} />);
    expect(await screen.findByText('hello world')).toBeInTheDocument();
  });

  it('shows metadata only for an empty file', async () => {
    render(<DetailPane selected={nodeOf('e.txt', [], 'text/plain')} />);
    expect(await screen.findByText('0 B')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders markdown, sanitizes it, and toggles to raw', async () => {
    const md = '# Title\n\n<script>window.x=1</script>';
    const { container } = render(<DetailPane selected={nodeOf('r.md', [md])} />);
    expect(await screen.findByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Raw' }));
    expect(screen.getByText(/# Title/)).toBeInTheDocument();
  });

  it('remembers a corrupt file and does not re-read it', async () => {
    const node = nodeOf('bad.txt', [new Uint8Array([0xff, 0xfe])]);
    const first = render(<DetailPane selected={node} />);
    expect(await screen.findByText(/can’t preview/i)).toBeInTheDocument();
    first.unmount();

    const file = await node.handle.getFile();
    const spy = vi.spyOn(file, 'slice');
    render(<DetailPane selected={node} />);
    expect(await screen.findByText(/can’t preview/i)).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows metadata only for .docx', async () => {
    render(<DetailPane selected={nodeOf('a.docx', ['PK'])} />);
    expect(await screen.findByText('2 B')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
});

describe('DetailPane modified time', () => {
  it('shows the relative time next to the modified date', async () => {
    const threeDaysAgo = Date.now() - 3 * 86_400_000 - 60_000;
    const file = new File(['x'], 'recent.txt', {
      type: 'text/plain',
      lastModified: threeDaysAgo,
    });
    const handle = {
      kind: 'file',
      name: 'recent.txt',
      getFile: async () => file,
    } as unknown as FileSystemFileHandle;
    const node: FileNode = {
      kind: 'file',
      name: 'recent.txt',
      path: 'recent.txt',
      handle,
    };
    render(<DetailPane selected={node} />);
    expect(await screen.findByText(/3 days ago/)).toBeInTheDocument();
  });
});

describe('DetailPane', () => {
  it('shows a placeholder when nothing is selected', () => {
    render(<DetailPane selected={null} />);
    expect(
      screen.getByText(/select a file to see its details/i),
    ).toBeInTheDocument();
  });

  it('renders file name, kind, size and type', async () => {
    render(<DetailPane selected={textFileNode()} />);

    expect(screen.getByRole('heading', { name: 'note.txt' })).toBeInTheDocument();
    expect(screen.getByText('Plain text')).toBeInTheDocument();

    // Metadata loads asynchronously from the file handle.
    expect(await screen.findByText('11 B')).toBeInTheDocument();
    expect(screen.getByText('text/plain')).toBeInTheDocument();
  });

  it('labels a selected directory as a folder', () => {
    const dir = {
      kind: 'directory' as const,
      name: 'photos',
      path: 'photos',
      handle: {} as unknown as FileSystemDirectoryHandle,
    };
    render(<DetailPane selected={dir} />);
    expect(screen.getByRole('heading', { name: 'photos' })).toBeInTheDocument();
    expect(screen.getByText('Folder')).toBeInTheDocument();
  });
});
