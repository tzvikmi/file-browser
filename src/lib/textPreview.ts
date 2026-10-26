export const MAX_PREVIEW_BYTES = 1024 * 1024;

function readBytes(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

export type TextPreviewResult =
  | { status: 'ok'; text: string; truncated: boolean }
  | { status: 'empty' }
  | { status: 'corrupt' };

/**
 * Reads up to `maxBytes` of a file as UTF-8 text. Invalid UTF-8 or NUL bytes
 * (binary content) are reported as corrupt rather than shown as garbage.
 */
export async function readTextPreview(
  file: File,
  maxBytes = MAX_PREVIEW_BYTES,
): Promise<TextPreviewResult> {
  if (file.size === 0) return { status: 'empty' };
  const truncated = file.size > maxBytes;
  const bytes = await readBytes(file.slice(0, maxBytes));
  if (bytes.includes(0)) return { status: 'corrupt' };
  let text: string;
  try {
    // stream:true tolerates a multibyte char cut by the slice boundary.
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes, {
      stream: truncated,
    });
  } catch {
    return { status: 'corrupt' };
  }
  if (text.trim() === '') return { status: 'empty' };
  return { status: 'ok', text, truncated };
}
