import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Gallery from '../src/components/Gallery.astro';
import { photos } from '../src/data/photos';

describe('Gallery', () => {
  it('renders one figure button per photo with alt + data-full attributes', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Gallery);

    const buttonCount = (html.match(/data-lightbox-item/g) || []).length;
    expect(buttonCount).toBe(photos.length);

    // Each item exposes a full-size src for the lightbox.
    const fullCount = (html.match(/data-full="/g) || []).length;
    expect(fullCount).toBe(photos.length);

    // Alt text from the first photo is present.
    expect(html).toContain(photos[0].alt);
  });
});
