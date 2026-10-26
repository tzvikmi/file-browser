import { describe, expect, it } from 'vitest';
import {
  extname,
  formatBytes,
  formatRelative,
  isImage,
  isMarkdown,
  isText,
  isImageName,
  kindFromName,
} from './format';

describe('formatBytes', () => {
  it('handles zero and small byte counts', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  it('converts across units at 1024 boundaries', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatBytes(5 * 1024 * 1024 * 1024)).toBe('5.0 GB');
  });

  it('respects the decimals argument', () => {
    expect(formatBytes(1536, 0)).toBe('2 KB');
    expect(formatBytes(1536, 2)).toBe('1.50 KB');
  });

  it('returns an em dash for invalid input', () => {
    expect(formatBytes(-1)).toBe('—');
    expect(formatBytes(NaN)).toBe('—');
    expect(formatBytes(Infinity)).toBe('—');
  });
});

describe('extname', () => {
  it('extracts a lowercased extension', () => {
    expect(extname('Photo.JPG')).toBe('jpg');
    expect(extname('archive.tar.gz')).toBe('gz');
  });

  it('returns empty when there is no real extension', () => {
    expect(extname('README')).toBe('');
    expect(extname('.gitignore')).toBe('');
    expect(extname('trailing.')).toBe('');
  });
});

describe('image detection', () => {
  it('detects images by extension', () => {
    expect(isImageName('a.png')).toBe(true);
    expect(isImageName('a.HEIC')).toBe(true);
    expect(isImageName('a.txt')).toBe(false);
  });

  it('detects images by MIME type', () => {
    expect(isImage('weird', 'image/webp')).toBe(true);
    expect(isImage('note.txt', 'text/plain')).toBe(false);
  });
});

describe('kindFromName', () => {
  it('maps known extensions to labels', () => {
    expect(kindFromName('a.png')).toBe('PNG image');
    expect(kindFromName('a.pdf')).toBe('PDF document');
  });

  it('falls back for unknown or missing extensions', () => {
    expect(kindFromName('a.xyz')).toBe('XYZ file');
    expect(kindFromName('Makefile')).toBe('File');
  });
});

describe('formatRelative', () => {
  const now = Date.UTC(2026, 0, 1);
  const MIN = 60_000;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;

  it('says "just now" under a minute, either direction', () => {
    expect(formatRelative(now, now)).toBe('just now');
    expect(formatRelative(now - 59_000, now)).toBe('just now');
    expect(formatRelative(now + 30_000, now)).toBe('just now');
  });

  it('formats minutes, hours and days in the past', () => {
    expect(formatRelative(now - 5 * MIN, now)).toBe('5 minutes ago');
    expect(formatRelative(now - 3 * HOUR, now)).toBe('3 hours ago');
    expect(formatRelative(now - 3 * DAY, now)).toBe('3 days ago');
  });

  it('formats months and years in the past', () => {
    expect(formatRelative(now - 60 * DAY, now)).toBe('2 months ago');
    expect(formatRelative(now - 800 * DAY, now)).toBe('2 years ago');
  });

  it('uses singular units at exactly one', () => {
    expect(formatRelative(now - MIN, now)).toBe('1 minute ago');
    expect(formatRelative(now - DAY, now)).toBe('1 day ago');
  });

  it('handles a future date', () => {
    expect(formatRelative(now + 2 * DAY, now)).toBe('in 2 days');
  });

  it('returns an em dash for invalid input', () => {
    expect(formatRelative(NaN, now)).toBe('—');
    expect(formatRelative(now, Infinity)).toBe('—');
  });
});

describe('isText / isMarkdown', () => {
  it('detects text by extension or MIME, not docs or images', () => {
    expect(isText('a.txt')).toBe(true);
    expect(isText('a.bin', 'text/plain')).toBe(true);
    expect(isText('a.docx')).toBe(false);
    expect(isText('a.svg', 'image/svg+xml')).toBe(false);
    expect(isMarkdown('README.MD')).toBe(true);
    expect(isMarkdown('a.txt')).toBe(false);
  });
});
