import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Hero from '../src/components/Hero.astro';
import { site } from '../src/data/site';

describe('Hero', () => {
  it('renders the name, intro, in-hero nav, socials, and an image', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero);
    expect(html).toContain(site.name);
    expect(html).toContain(site.intro);
    // The home hero carries its own nav (no site header on the home page).
    expect(html).toContain('href="/portfolio"');
    expect(html).toContain('href="/contact"');
    // Social links are rendered with their label as an aria-label.
    expect(html).toContain(`aria-label="${site.socials[0].label}"`);
    expect(html).toContain('<img');
  });
});
