import { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import type { TextPreviewResult } from '../lib/textPreview';
import { isMarkdown } from '../lib/format';
import styles from './TextPreview.module.css';

interface TextPreviewProps {
  name: string;
  preview: TextPreviewResult;
}

export function TextPreview({ name, preview }: TextPreviewProps) {
  const [raw, setRaw] = useState(false);
  const markdown = isMarkdown(name);
  const text = preview.status === 'ok' ? preview.text : '';
  const html = useMemo(
    () =>
      markdown && !raw && text
        ? DOMPurify.sanitize(marked.parse(text, { async: false }))
        : '',
    [markdown, raw, text],
  );

  if (preview.status === 'empty') return null;

  if (preview.status === 'corrupt') {
    return (
      <p className={styles.note}>
        Can’t preview this file (unreadable or not valid text).
      </p>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>Content</h2>
        {markdown && (
          <div role="group" aria-label="Markdown view" className={styles.toggle}>
            <button type="button" aria-pressed={!raw} onClick={() => setRaw(false)}>
              Rendered
            </button>
            <button type="button" aria-pressed={raw} onClick={() => setRaw(true)}>
              Raw
            </button>
          </div>
        )}
      </div>
      {markdown && !raw ? (
        <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className={styles.pre}>{text}</pre>
      )}
      {preview.truncated && (
        <p className={styles.note}>Showing the first 1 MiB only.</p>
      )}
    </div>
  );
}
