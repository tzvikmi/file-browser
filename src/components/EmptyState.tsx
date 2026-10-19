import styles from './EmptyState.module.css';

interface EmptyStateProps {
  supported: boolean;
  error: string | null;
  onPick: () => void;
}

export function EmptyState({ supported, error, onPick }: EmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className={styles.title}>File Explorer</h1>

      {supported ? (
        <>
          <p className={styles.hint}>
            Pick a folder to browse it as a tree. Everything stays on your
            machine — read-only, no uploads, nothing saved.
          </p>
          <button type="button" className={styles.button} onClick={onPick}>
            Pick a folder…
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </>
      ) : (
        <p className={styles.unsupported}>
          This explorer needs the File System Access API, which isn’t available
          in this browser. Please open it in a Chromium-based browser such as
          Chrome, Edge, or Brave.
        </p>
      )}
    </div>
  );
}
