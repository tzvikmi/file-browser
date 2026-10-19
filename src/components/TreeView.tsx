import { useEffect, useState } from 'react';
import type { FsNode } from '../lib/types';
import { readDirectory } from '../lib/readTree';
import { TreeNode } from './TreeNode';
import styles from './Tree.module.css';

interface TreeViewProps {
  root: FileSystemDirectoryHandle;
  selectedPath: string | null;
  onSelect: (node: FsNode) => void;
}

export function TreeView({ root, selectedPath, onSelect }: TreeViewProps) {
  const [children, setChildren] = useState<FsNode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setChildren(null);
    setError(null);
    readDirectory(root, '')
      .then((kids) => {
        if (active) setChildren(kids);
      })
      .catch(() => {
        if (active) setError('Unable to read this folder.');
      });
    return () => {
      active = false;
    };
  }, [root]);

  return (
    <nav className={styles.tree} aria-label="Folder tree">
      {error && <div className={styles.meta}>{error}</div>}
      {!error && children === null && <div className={styles.meta}>Loading…</div>}
      {children && children.length === 0 && (
        <div className={styles.meta}>This folder is empty.</div>
      )}
      {children && children.length > 0 && (
        <ul className={styles.list}>
          {children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={0}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}
