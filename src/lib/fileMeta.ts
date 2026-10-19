import type { FileMetadata } from './types';

/** Extracts metadata from an in-memory File object. */
export function fileToMetadata(file: File): FileMetadata {
  return {
    name: file.name,
    size: file.size,
    type: file.type || '',
    lastModified: file.lastModified,
  };
}

/** Reads a file handle and returns its metadata. */
export async function getFileMetadata(
  handle: FileSystemFileHandle,
): Promise<FileMetadata> {
  const file = await handle.getFile();
  return fileToMetadata(file);
}
