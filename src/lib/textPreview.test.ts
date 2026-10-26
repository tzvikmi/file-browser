import { readTextPreview } from './textPreview';

const f = (parts: BlobPart[]) => new File(parts, 'a.txt');

describe('readTextPreview', () => {
  it('returns text', async () => {
    expect(await readTextPreview(f(['héllo']))).toEqual({ status: 'ok', text: 'héllo', truncated: false });
  });
  it('flags empty and whitespace-only', async () => {
    expect(await readTextPreview(f([]))).toEqual({ status: 'empty' });
    expect(await readTextPreview(f(['  \n']))).toEqual({ status: 'empty' });
  });
  it('truncates, tolerating a split multibyte char', async () => {
    const r = await readTextPreview(f(['aé']), 2);
    expect(r).toEqual({ status: 'ok', text: 'a', truncated: true });
  });
  it('flags invalid UTF-8 and NUL bytes', async () => {
    expect(await readTextPreview(f([new Uint8Array([0xff, 0xfe, 0x41])]))).toEqual({ status: 'corrupt' });
    expect(await readTextPreview(f([new Uint8Array([0x41, 0, 0x42])]))).toEqual({ status: 'corrupt' });
  });
});
