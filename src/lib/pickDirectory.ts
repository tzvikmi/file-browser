// Thin, read-only wrapper over the File System Access API.
// No network, no persistence, no write permission is ever requested.

interface DirectoryPickerWindow {
  showDirectoryPicker?: (options?: {
    mode?: 'read' | 'readwrite';
    id?: string;
    startIn?: string;
  }) => Promise<FileSystemDirectoryHandle>;
}

/** Raised when the browser lacks the File System Access API. */
export class PickerUnsupportedError extends Error {
  constructor() {
    super('This browser does not support the File System Access API.');
    this.name = 'PickerUnsupportedError';
  }
}

/** Raised when the user dismisses the picker without choosing a folder. */
export class PickerCancelledError extends Error {
  constructor() {
    super('Folder selection was cancelled.');
    this.name = 'PickerCancelledError';
  }
}

export function isDirectoryPickerSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as unknown as DirectoryPickerWindow).showDirectoryPicker ===
      'function'
  );
}

/**
 * Prompts the user to pick a directory. Must be called from a user gesture.
 * Requests read-only access only.
 */
export async function pickDirectory(): Promise<FileSystemDirectoryHandle> {
  const w = window as unknown as DirectoryPickerWindow;
  if (typeof w.showDirectoryPicker !== 'function') {
    throw new PickerUnsupportedError();
  }
  try {
    return await w.showDirectoryPicker({ mode: 'read' });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new PickerCancelledError();
    }
    throw err;
  }
}
