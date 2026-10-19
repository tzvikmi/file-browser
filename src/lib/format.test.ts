import { describe, expect, it } from 'vitest';
import {
  extname,
  formatBytes,
  isImage,
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
