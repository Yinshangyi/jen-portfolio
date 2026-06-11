import { describe, it, expect } from 'vitest';
import { photos } from '../src/data/photos';

describe('photos', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(photos)).toBe(true);
    expect(photos.length).toBeGreaterThan(0);
  });

  it('every photo has an imported image and non-empty alt text', () => {
    for (const p of photos) {
      expect(p.image).toBeTruthy();
      expect(typeof p.alt).toBe('string');
      expect(p.alt.trim().length).toBeGreaterThan(0);
    }
  });
});
