import { corruptKey, isKnownCorrupt, markCorrupt } from './corruptCache';

beforeEach(() => localStorage.clear());

describe('corruptCache', () => {
  it('round-trips and invalidates when the file changes', () => {
    markCorrupt(corruptKey('a.txt', 10, 1));
    expect(isKnownCorrupt(corruptKey('a.txt', 10, 1))).toBe(true);
    expect(isKnownCorrupt(corruptKey('a.txt', 11, 1))).toBe(false);
    expect(isKnownCorrupt(corruptKey('a.txt', 10, 2))).toBe(false);
  });
  it('survives storage throwing', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('x'); });
    expect(isKnownCorrupt('k')).toBe(false);
    expect(() => markCorrupt('k')).not.toThrow();
    spy.mockRestore();
  });
});
