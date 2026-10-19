import { useCallback, useState } from 'react';
import type { FsNode } from './lib/types';
import {
  PickerCancelledError,
  PickerUnsupportedError,
  isDirectoryPickerSupported,
  pickDirectory,
} from './lib/pickDirectory';
import { EmptyState } from './components/EmptyState';
import { TreeView } from './components/TreeView';
import { DetailPane } from './components/DetailPane';
import styles from './App.module.css';

interface RootState {
  handle: FileSystemDirectoryHandle;
  name: string;
}

export function App() {
  const supported = isDirectoryPickerSupported();
  const [root, setRoot] = useState<RootState | null>(null);
  const [selected, setSelected] = useState<FsNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePick = useCallback(async () => {
    setError(null);
    try {
      const handle = await pickDirectory();
      setRoot({ handle, name: handle.name });
      setSelected(null);
    } catch (err) {
      if (err instanceof PickerCancelledError) return;
      if (err instanceof PickerUnsupportedError) {
        setError(err.message);
        return;
      }
      setError('Could not open that folder.');
    }
  }, []);

  if (!root) {
    return <EmptyState supported={supported} error={error} onPick={handlePick} />;
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.rootName} title={root.name}>
          {root.name}
        </span>
        {error && <span className={styles.error}>{error}</span>}
        <span className={styles.spacer} />
        <button type="button" className={styles.openButton} onClick={handlePick}>
          Open folder…
        </button>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <TreeView
            root={root.handle}
            selectedPath={selected?.path ?? null}
            onSelect={setSelected}
          />
        </aside>
        <main className={styles.detail}>
          <DetailPane selected={selected} />
        </main>
      </div>
    </div>
  );
}
