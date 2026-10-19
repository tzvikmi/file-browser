import type { ImageDimensions } from '../lib/types';
import styles from './DetailPane.module.css';

interface ImageDetailsProps {
  previewUrl: string | null;
  dimensions: ImageDimensions | null;
  exif: Record<string, unknown> | null;
  name: string;
}

const EXIF_LABELS: Record<string, string> = {
  Make: 'Camera make',
  Model: 'Camera model',
  LensModel: 'Lens',
  DateTimeOriginal: 'Taken',
  ISO: 'ISO',
  FNumber: 'Aperture',
  ExposureTime: 'Shutter',
  FocalLength: 'Focal length',
  Orientation: 'Orientation',
  latitude: 'Latitude',
  longitude: 'Longitude',
};

function formatExifValue(key: string, value: unknown): string {
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'number') {
    switch (key) {
      case 'FNumber':
        return `f/${value}`;
      case 'FocalLength':
        return `${value} mm`;
      case 'ExposureTime':
        return value < 1 && value > 0
          ? `1/${Math.round(1 / value)} s`
          : `${value} s`;
      case 'latitude':
      case 'longitude':
        return value.toFixed(5);
      default:
        return String(value);
    }
  }
  return String(value);
}

export function ImageDetails({
  previewUrl,
  dimensions,
  exif,
  name,
}: ImageDetailsProps) {
  const exifEntries = exif
    ? Object.entries(exif).filter(([, v]) => v !== undefined && v !== null)
    : [];

  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Preview</h2>
        {previewUrl ? (
          <img className={styles.preview} src={previewUrl} alt={name} />
        ) : (
          <p className={styles.muted}>Preview unavailable.</p>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Image</h2>
        <dl className={styles.table}>
          <dt className={styles.key}>Dimensions</dt>
          <dd className={styles.value}>
            {dimensions
              ? `${dimensions.width} × ${dimensions.height} px`
              : 'Unknown'}
          </dd>
        </dl>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>EXIF</h2>
        {exifEntries.length > 0 ? (
          <dl className={styles.table}>
            {exifEntries.map(([key, value]) => (
              <div
                key={key}
                style={{ display: 'contents' }}
              >
                <dt className={styles.key}>{EXIF_LABELS[key] ?? key}</dt>
                <dd className={styles.value}>{formatExifValue(key, value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className={styles.muted}>No EXIF metadata.</p>
        )}
      </div>
    </>
  );
}
