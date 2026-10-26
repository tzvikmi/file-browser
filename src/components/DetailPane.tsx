import type { FsNode } from '../lib/types';
import { formatBytes, formatDate, kindFromName } from '../lib/format';
import { useFileDetails } from '../hooks/useFileDetails';
import { ImageDetails } from './ImageDetails';
import { TextPreview } from './TextPreview';
import styles from './DetailPane.module.css';

interface DetailPaneProps {
  selected: FsNode | null;
}

export function DetailPane({ selected }: DetailPaneProps) {
  const fileNode = selected?.kind === 'file' ? selected : null;
  const details = useFileDetails(fileNode);

  if (!selected) {
    return (
      <section className={styles.pane}>
        <div className={styles.placeholder}>Select a file to see its details.</div>
      </section>
    );
  }

  if (selected.kind === 'directory') {
    return (
      <section className={styles.pane}>
        <header className={styles.header}>
          <h1 className={styles.name}>{selected.name}</h1>
          <span className={styles.kind}>Folder</span>
        </header>
        <p className={styles.muted}>
          Expand this folder in the tree to browse its contents.
        </p>
      </section>
    );
  }

  const { metadata, isImage, previewUrl, dimensions, exif, preview, loading, error } =
    details;

  return (
    <section className={styles.pane}>
      <header className={styles.header}>
        <h1 className={styles.name}>{selected.name}</h1>
        <span className={styles.kind}>{kindFromName(selected.name)}</span>
      </header>

      {loading && <p className={styles.muted}>Reading file…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {metadata && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Information</h2>
          <dl className={styles.table}>
            <dt className={styles.key}>Size</dt>
            <dd className={styles.value}>{formatBytes(metadata.size)}</dd>
            <dt className={styles.key}>Type</dt>
            <dd className={styles.value}>{metadata.type || '—'}</dd>
            <dt className={styles.key}>Modified</dt>
            <dd className={styles.value}>{formatDate(metadata.lastModified)}</dd>
          </dl>
        </div>
      )}

      {metadata && isImage && (
        <ImageDetails
          previewUrl={previewUrl}
          dimensions={dimensions}
          exif={exif}
          name={selected.name}
        />
      )}

      {metadata && preview && (
        <TextPreview name={selected.name} preview={preview} />
      )}
    </section>
  );
}
