import exifr from 'exifr';
import type { ImageDimensions } from './types';

/** A whitelisted, human-meaningful subset of EXIF tags to surface. */
export const EXIF_FIELDS = [
  'Make',
  'Model',
  'LensModel',
  'DateTimeOriginal',
  'ISO',
  'FNumber',
  'ExposureTime',
  'FocalLength',
  'Orientation',
] as const;

/** Decodes an image to read its pixel dimensions. Returns null on failure. */
export async function getImageDimensions(
  file: File,
): Promise<ImageDimensions | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return null;
  }
}

/**
 * Parses a curated set of EXIF tags plus GPS coordinates when present.
 * Returns null when the file has no readable EXIF data.
 */
export async function getExif(
  file: File,
): Promise<Record<string, unknown> | null> {
  const result: Record<string, unknown> = {};

  try {
    const data = (await exifr.parse(file)) as
      | Record<string, unknown>
      | undefined;
    if (data) {
      for (const field of EXIF_FIELDS) {
        const value = data[field];
        if (value !== undefined && value !== null) result[field] = value;
      }
    }
  } catch {
    // No EXIF / unreadable — fall through.
  }

  try {
    const gps = await exifr.gps(file);
    if (gps && typeof gps.latitude === 'number') result.latitude = gps.latitude;
    if (gps && typeof gps.longitude === 'number') {
      result.longitude = gps.longitude;
    }
  } catch {
    // No GPS — ignore.
  }

  return Object.keys(result).length > 0 ? result : null;
}
