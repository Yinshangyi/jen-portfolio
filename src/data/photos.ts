import type { ImageMetadata } from 'astro';
import shot01 from '../assets/portfolio/shot-01.jpg';
import shot02 from '../assets/portfolio/shot-02.jpg';
import shot03 from '../assets/portfolio/shot-03.jpg';

export interface Photo {
  /** Imported image asset — Astro optimizes it at build time. */
  image: ImageMetadata;
  /** Required for accessibility + SEO. */
  alt: string;
  /** Optional caption shown in the lightbox. */
  caption?: string;
}

// Display order is array order. To add a photo: drop the file in
// src/assets/portfolio/, import it, and add an entry here.
export const photos: Photo[] = [
  { image: shot01, alt: 'Portrait — placeholder 1' },
  { image: shot02, alt: 'Portrait — placeholder 2' },
  { image: shot03, alt: 'Portrait — placeholder 3' },
];
