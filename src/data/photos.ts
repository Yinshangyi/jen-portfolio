import type { ImageMetadata } from 'astro';
import { site } from './site';

export interface Photo {
  /** Imported image asset — Astro optimizes it at build time. */
  image: ImageMetadata;
  /** Required for accessibility + SEO. */
  alt: string;
  /** Optional caption shown in the lightbox. */
  caption?: string;
}

// All images in src/assets/portfolio/ are picked up automatically — to add a
// photo, just drop the file in that folder. Display order is by filename, so
// prefix names (e.g. 01-, 02-) if you want to control the order.
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/portfolio/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

// Optional per-file overrides for nicer alt text / captions. Key by filename.
// Anything not listed falls back to a generic, descriptive alt.
const overrides: Record<string, { alt?: string; caption?: string }> = {
  // 'DSCF6753.jpg': { alt: 'Jenny in a black blazer, Paris street', caption: '' },
};

export const photos: Photo[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => {
    const file = path.split('/').pop() ?? '';
    const override = overrides[file] ?? {};
    return {
      image: mod.default,
      alt: override.alt ?? `${site.name} — portfolio photograph`,
      caption: override.caption,
    };
  });
