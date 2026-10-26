import { useEffect, useState } from 'react';
import type { FileMetadata, FileNode, ImageDimensions } from '../lib/types';
import { fileToMetadata } from '../lib/fileMeta';
import { isImage, isText } from '../lib/format';
import { readTextPreview, type TextPreviewResult } from '../lib/textPreview';
import { corruptKey, isKnownCorrupt, markCorrupt } from '../lib/corruptCache';
import { getExif, getImageDimensions } from '../lib/imageMeta';

export interface FileDetails {
  metadata: FileMetadata | null;
  isImage: boolean;
  previewUrl: string | null;
  dimensions: ImageDimensions | null;
  exif: Record<string, unknown> | null;
  preview: TextPreviewResult | null;
  loading: boolean;
  error: string | null;
}

const EMPTY: FileDetails = {
  metadata: null,
  isImage: false,
  previewUrl: null,
  dimensions: null,
  exif: null,
  preview: null,
  loading: false,
  error: null,
};

/**
 * Loads metadata (and, for images, dimensions + EXIF + a preview URL) for the
 * selected file. The object URL is revoked when the selection changes or the
 * component unmounts, so previews never leak.
 */
export function useFileDetails(node: FileNode | null): FileDetails {
  const [details, setDetails] = useState<FileDetails>(EMPTY);

  useEffect(() => {
    if (!node) {
      setDetails(EMPTY);
      return;
    }

    let active = true;
    let objectUrl: string | null = null;
    setDetails({ ...EMPTY, loading: true });

    (async () => {
      try {
        const file = await node.handle.getFile();
        const metadata = fileToMetadata(file);
        const image = isImage(file.name, file.type);

        let previewUrl: string | null = null;
        let dimensions: ImageDimensions | null = null;
        let exif: Record<string, unknown> | null = null;

        if (image) {
          objectUrl = URL.createObjectURL(file);
          previewUrl = objectUrl;
          dimensions = await getImageDimensions(file);
          exif = await getExif(file);
        }

        let preview: TextPreviewResult | null = null;
        if (isText(file.name, file.type)) {
          const key = corruptKey(node.path, file.size, file.lastModified);
          if (isKnownCorrupt(key)) {
            preview = { status: 'corrupt' };
          } else {
            preview = await readTextPreview(file);
            if (preview.status === 'corrupt') markCorrupt(key);
          }
        }

        if (!active) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return;
        }

        setDetails({
          metadata,
          isImage: image,
          previewUrl,
          dimensions,
          exif,
          preview,
          loading: false,
          error: null,
        });
      } catch {
        if (active) {
          setDetails({ ...EMPTY, error: 'Unable to read this file.' });
        }
      }
    })();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [node]);

  return details;
}
