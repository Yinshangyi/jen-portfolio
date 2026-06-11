import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from '../src/lib/lightbox';

describe('lightbox navigation', () => {
  it('advances to the next index', () => {
    expect(nextIndex(0, 3)).toBe(1);
  });
  it('wraps from last to first', () => {
    expect(nextIndex(2, 3)).toBe(0);
  });
  it('goes to the previous index', () => {
    expect(prevIndex(2, 3)).toBe(1);
  });
  it('wraps from first to last', () => {
    expect(prevIndex(0, 3)).toBe(2);
  });
  it('handles a single-image gallery', () => {
    expect(nextIndex(0, 1)).toBe(0);
    expect(prevIndex(0, 1)).toBe(0);
  });
});
