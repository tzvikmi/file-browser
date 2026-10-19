import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
