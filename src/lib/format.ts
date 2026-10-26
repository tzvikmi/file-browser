// Pure formatting + classification helpers. No side effects, no I/O.

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/** Human-readable byte size, e.g. 1536 -> "1.5 KB". */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    BYTE_UNITS.length - 1,
  );
  if (i === 0) return `${bytes} B`;
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(decimals)} ${BYTE_UNITS[i]}`;
}

/** Locale date-time string, or an em dash for invalid input. */
export function formatDate(epochMs: number): string {
  if (!Number.isFinite(epochMs)) return '—';
  return new Date(epochMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'always' });

/**
 * Relative time such as "3 days ago" or "in 2 hours". `nowMs` is a parameter
 * so the function stays pure; under a minute either way reads "just now".
 */
export function formatRelative(epochMs: number, nowMs: number): string {
  if (!Number.isFinite(epochMs) || !Number.isFinite(nowMs)) return '—';
  const diff = epochMs - nowMs;
  const abs = Math.abs(diff);
  if (abs < MINUTE) return 'just now';

  const sign = diff < 0 ? -1 : 1;
  const [unit, size]: [Intl.RelativeTimeFormatUnit, number] =
    abs < HOUR ? ['minute', MINUTE]
    : abs < DAY ? ['hour', HOUR]
    : abs < MONTH ? ['day', DAY]
    : abs < YEAR ? ['month', MONTH]
    : ['year', YEAR];
  return relativeFormat.format(sign * Math.floor(abs / size), unit);
}

/** Lowercased extension without the dot, or "" when there is none. */
export function extname(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || dot === name.length - 1) return '';
  return name.slice(dot + 1).toLowerCase();
}

const IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg',
  'avif', 'heic', 'heif', 'tif', 'tiff', 'ico',
]);

export function isImageType(mime: string): boolean {
  return mime.startsWith('image/');
}

export function isImageName(name: string): boolean {
  return IMAGE_EXTENSIONS.has(extname(name));
}

/** True when the MIME type or the file extension indicates an image. */
export function isImage(name: string, mime = ''): boolean {
  return isImageType(mime) || isImageName(name);
}

const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'json', 'csv', 'tsv', 'xml', 'yml', 'yaml', 'toml',
  'ini', 'log', 'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'html', 'htm', 'css',
  'scss', 'sh', 'py', 'rb', 'go', 'rs', 'java', 'c', 'h', 'cpp', 'sql', 'env',
]);

/** True when the MIME type or extension indicates readable text (not .doc/.docx/.pdf). */
export function isText(name: string, mime = ''): boolean {
  if (isImage(name, mime)) return false;
  return mime.startsWith('text/') || TEXT_EXTENSIONS.has(extname(name));
}

export function isMarkdown(name: string): boolean {
  const ext = extname(name);
  return ext === 'md' || ext === 'markdown';
}

const KIND_LABELS: Record<string, string> = {
  jpg: 'JPEG image',
  jpeg: 'JPEG image',
  png: 'PNG image',
  gif: 'GIF image',
  webp: 'WebP image',
  svg: 'SVG image',
  bmp: 'Bitmap image',
  avif: 'AVIF image',
  heic: 'HEIC image',
  heif: 'HEIF image',
  tif: 'TIFF image',
  tiff: 'TIFF image',
  ico: 'Icon',
  pdf: 'PDF document',
  txt: 'Plain text',
  md: 'Markdown',
  json: 'JSON',
  js: 'JavaScript',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  ts: 'TypeScript',
  tsx: 'TypeScript JSX',
  jsx: 'JavaScript JSX',
  html: 'HTML document',
  css: 'Stylesheet',
  zip: 'ZIP archive',
  gz: 'Gzip archive',
  tar: 'Tar archive',
  mp4: 'MP4 video',
  mov: 'QuickTime video',
  webm: 'WebM video',
  mp3: 'MP3 audio',
  wav: 'WAV audio',
  flac: 'FLAC audio',
  csv: 'CSV',
  xml: 'XML',
  yml: 'YAML',
  yaml: 'YAML',
};

/** Human label for a file, derived from its extension. */
export function kindFromName(name: string): string {
  const ext = extname(name);
  if (!ext) return 'File';
  return KIND_LABELS[ext] ?? `${ext.toUpperCase()} file`;
}
