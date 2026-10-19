import { useState } from 'react';
import type { FsNode } from '../lib/types';
import { readDirectory } from '../lib/readTree';
import { ChevronIcon, FileIcon, FolderIcon } from './icons';
import styles from './Tree.module.css';

interface TreeNodeProps {
  node: FsNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (node: FsNode) => void;
}

export function TreeNode({ node, depth, selectedPath, onSelect }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<FsNode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDir = node.kind === 'directory';
  const selected = selectedPath === node.path;

  async function handleClick() {
    onSelect(node);
    if (!isDir) return;

    if (!expanded && children === null) {
      setLoading(true);
      setError(null);
      try {
        const kids = await readDirectory(node.handle, node.path);
        setChildren(kids);
      } catch {
        setError('Unable to read folder.');
      } finally {
        setLoading(false);
      }
    }
    setExpanded((v) => !v);
  }

  return (
    <li>
      <button
        type="button"
        className={`${styles.row} ${selected ? styles.selected : ''}`}
        style={{ paddingLeft: `calc(${depth} * var(--space-4) + var(--space-2))` }}
        onClick={handleClick}
        aria-expanded={isDir ? expanded : undefined}
      >
        {isDir ? (
          <ChevronIcon
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
          />
        ) : (
          <span className={styles.chevronSpacer} />
        )}
        {isDir ? (
          <FolderIcon className={styles.typeIcon} />
        ) : (
          <FileIcon className={styles.typeIcon} />
        )}
        <span className={styles.name}>{node.name}</span>
      </button>

      {isDir && expanded && (
        <>
          {loading && (
            <div
              className={styles.meta}
              style={{ paddingLeft: `calc(${depth + 1} * var(--space-4))` }}
            >
              Loading…
            </div>
          )}
          {error && (
            <div
              className={styles.meta}
              style={{ paddingLeft: `calc(${depth + 1} * var(--space-4))` }}
            >
              {error}
            </div>
          )}
          {children && children.length === 0 && !loading && (
            <div
              className={styles.meta}
              style={{ paddingLeft: `calc(${depth + 1} * var(--space-4))` }}
            >
              Empty folder
            </div>
          )}
          {children && children.length > 0 && (
            <ul className={styles.list}>
              {children.map((child) => (
                <TreeNode
                  key={child.path}
                  node={child}
                  depth={depth + 1}
                  selectedPath={selectedPath}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
}
