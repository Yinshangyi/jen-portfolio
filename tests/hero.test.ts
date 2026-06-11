import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Hero from '../src/components/Hero.astro';
import { site } from '../src/data/site';

describe('Hero', () => {
  it('renders the name, tagline, intro, and an image', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero);
    expect(html).toContain(site.name);
    expect(html).toContain(site.tagline);
    expect(html).toContain(site.intro);
    expect(html).toContain('<img');
  });
});
