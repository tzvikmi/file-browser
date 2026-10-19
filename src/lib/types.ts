// Framework-free domain types. This module (and everything under src/lib)
// must never import React or any UI framework.

export type FsKind = 'file' | 'directory';

export interface DirNode {
  kind: 'directory';
  /** Entry name, e.g. "photos". */
  name: string;
  /** Path relative to the picked root, e.g. "photos/2024". Unique per tree. */
  path: string;
  handle: FileSystemDirectoryHandle;
}

export interface FileNode {
  kind: 'file';
  name: string;
  path: string;
  handle: FileSystemFileHandle;
}

export type FsNode = DirNode | FileNode;

export interface FileMetadata {
  name: string;
  /** Size in bytes. */
  size: number;
  /** MIME type as reported by the browser, may be empty. */
  type: string;
  /** Last modified time, epoch milliseconds. */
  lastModified: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
