import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import BaseLayout from '../src/components/BaseLayout.astro';
import { site } from '../src/data/site';

describe('BaseLayout', () => {
  it('renders the site name and nav links in the header', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BaseLayout, {
      props: { title: 'Test Page' },
    });
    expect(html).toContain(site.name);
    expect(html).toContain('href="/portfolio"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('<title>Test Page');
  });
});
