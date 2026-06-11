# Model Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, minimalist 3-page static portfolio site (Home / Portfolio / Contact) for a model, with an optimized masonry gallery, a lightbox, and a working contact form — deployable to Netlify.

**Architecture:** Astro static site. Pages wrap a shared `BaseLayout`. The gallery renders from a single typed photo list; Astro's asset pipeline optimizes every image. The only client-side JS is the lightbox island on the Portfolio page and the contact form's submit handler. Pure logic (lightbox index navigation, contact validation) lives in small, unit-tested TS modules separate from the components that use them.

**Tech Stack:** Astro 5, Tailwind CSS v4 (via `@tailwindcss/vite`), Vitest (+ Astro Container API) for tests, Netlify hosting + Netlify Forms.

---

## File Structure

- `astro.config.mjs` — Astro + Tailwind Vite plugin + Vitest config.
- `src/styles/global.css` — Tailwind import + base typographic styles.
- `src/data/site.ts` — site-wide config (name, intro, socials, email, SEO).
- `src/data/photos.ts` — typed list of gallery photos (the gallery's source of truth).
- `src/lib/lightbox.ts` — pure index-navigation helpers (next/prev/clamp). Unit tested.
- `src/lib/validateContact.ts` — pure contact-form validation. Unit tested.
- `src/components/BaseLayout.astro` — `<head>`, header nav, footer with social icons.
- `src/components/Hero.astro` — homepage split-editorial hero.
- `src/components/Gallery.astro` — masonry grid of optimized thumbnails.
- `src/components/Lightbox.astro` — full-screen viewer overlay + wiring script.
- `src/components/ContactForm.astro` — Netlify form + client validation + success state.
- `src/pages/index.astro` — Home.
- `src/pages/portfolio.astro` — Portfolio (Gallery + Lightbox).
- `src/pages/contact.astro` — Contact (ContactForm + socials).
- `src/pages/404.astro` — Not found.
- `netlify.toml` — build command + publish dir.
- `tests/*.test.ts` — Vitest tests.

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`

- [ ] **Step 1: Scaffold a minimal Astro project into the current directory**

Run (in the project root, which already contains `.git`, `docs/`, `.gitignore`):

```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes .
```

Expected: creates `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`. If it refuses because the directory is non-empty, answer the prompt to continue / merge.

- [ ] **Step 2: Install dependencies (runtime + Tailwind v4 + test tooling)**

```bash
npm install
npm install tailwindcss @tailwindcss/vite
npm install -D vitest
```

Expected: installs succeed, `node_modules/` present (already gitignored).

- [ ] **Step 3: Configure Astro to use the Tailwind Vite plugin and Vitest**

Replace `astro.config.mjs` with:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Create the global stylesheet**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

:root {
  --bg: #ffffff;
  --fg: #1a1a1a;
  --muted: #888888;
  --accent: #f4f1ec;
}

html {
  font-family: ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
  color: var(--fg);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

body { margin: 0; }
```

- [ ] **Step 5: Configure Vitest to use Astro's Vite config**

This is required so tests can import images and `astro:assets` and render `.astro` components.

Create `vitest.config.ts`:

```ts
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // Container-API rendering and image imports run in a Node environment.
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 6: Add a `test` script to package.json**

In `package.json`, ensure the `"scripts"` block contains:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run"
}
```

- [ ] **Step 7: Verify the dev build boots**

Run: `npm run build`
Expected: build succeeds (the default minimal `index.astro` compiles). No errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Tailwind v4 and Vitest"
```

---

## Task 2: Site config and photo data model

**Files:**
- Create: `src/data/site.ts`, `src/data/photos.ts`
- Create: `src/assets/portfolio/.gitkeep`, `src/assets/hero.jpg` (placeholder image)
- Test: `tests/photos.test.ts`

- [ ] **Step 1: Write the failing test for the photo list shape**

Create `tests/photos.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/photos.test.ts`
Expected: FAIL — cannot resolve `../src/data/photos`.

- [ ] **Step 3: Add placeholder images so imports resolve**

Create the folder and a few placeholder images (any small jpgs are fine for now; the user replaces them later):

```bash
mkdir -p src/assets/portfolio
# create simple solid-color placeholder jpgs
node -e "const fs=require('fs');const b=Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AvwAH/9k=','base64');for(const n of ['shot-01','shot-02','shot-03']){fs.writeFileSync('src/assets/portfolio/'+n+'.jpg',b);} fs.writeFileSync('src/assets/hero.jpg',b);"
```

Expected: `src/assets/portfolio/shot-01.jpg`, `shot-02.jpg`, `shot-03.jpg`, and `src/assets/hero.jpg` exist.

- [ ] **Step 4: Create the typed photo list**

Create `src/data/photos.ts`:

```ts
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
```

- [ ] **Step 5: Create the site config**

Create `src/data/site.ts`:

```ts
export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  intro: string;
  email: string;
  socials: SocialLink[];
  seoDescription: string;
}

// Placeholder content — replace with the model's real name, intro, and links.
export const site: SiteConfig = {
  name: 'Sophie Martin',
  tagline: 'Model',
  intro:
    'Amateur model based in France. Available for editorial, portrait, and lifestyle shoots.',
  email: 'hello@example.com',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Email', href: 'mailto:hello@example.com' },
  ],
  seoDescription: 'Portfolio of Sophie Martin, model — editorial and portrait photography.',
};
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- tests/photos.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add site config and typed photo data model with tests"
```

---

## Task 3: BaseLayout (shared shell)

**Files:**
- Create: `src/components/BaseLayout.astro`
- Test: `tests/baseLayout.test.ts`

- [ ] **Step 1: Write the failing test (render via Astro Container API)**

Create `tests/baseLayout.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/baseLayout.test.ts`
Expected: FAIL — cannot resolve `BaseLayout.astro`.

- [ ] **Step 3: Implement BaseLayout**

Create `src/components/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import { site } from '../data/site';

interface Props {
  title?: string;
  description?: string;
}
const { title = site.name, description = site.seoDescription } = Astro.props;
const nav = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
  </head>
  <body class="min-h-screen flex flex-col">
    <header class="flex items-center gap-6 px-6 py-5 text-xs uppercase tracking-[0.2em]">
      <a href="/" class="mr-auto font-semibold tracking-[0.3em] text-base normal-case">{site.name}</a>
      {nav.map((item) => (
        <a href={item.href} class="text-neutral-600 hover:text-black transition-colors">{item.label}</a>
      ))}
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="px-6 py-8 flex gap-5 text-xs uppercase tracking-[0.2em] text-neutral-500">
      {site.socials.map((s) => (
        <a href={s.href} class="hover:text-black transition-colors" target="_blank" rel="noopener">{s.label}</a>
      ))}
    </footer>
  </body>
</html>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/baseLayout.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add BaseLayout shell with header nav and social footer"
```

---

## Task 4: Hero + Home page

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro` (replace scaffold content)
- Test: `tests/hero.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/hero.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/hero.test.ts`
Expected: FAIL — cannot resolve `Hero.astro`.

- [ ] **Step 3: Implement Hero (split-editorial layout)**

Create `src/components/Hero.astro`:

```astro
---
import { Image } from 'astro:assets';
import { site } from '../data/site';
import heroImage from '../assets/hero.jpg';
---
<section class="grid md:grid-cols-2 min-h-[70vh]">
  <div class="order-2 md:order-1 bg-[var(--accent)] flex flex-col justify-center px-8 py-16 md:px-16">
    <h1 class="text-3xl md:text-4xl font-light tracking-[0.15em]">{site.name}</h1>
    <p class="mt-3 text-xs uppercase tracking-[0.25em] text-neutral-500">{site.tagline}</p>
    <p class="mt-8 max-w-sm text-sm leading-relaxed text-neutral-600">{site.intro}</p>
    <a href="/portfolio" class="mt-10 text-xs uppercase tracking-[0.25em] underline underline-offset-4 hover:no-underline">
      View portfolio
    </a>
  </div>
  <div class="order-1 md:order-2">
    <Image src={heroImage} alt={`${site.name} — featured portrait`} class="w-full h-full object-cover" widths={[600, 900, 1400]} sizes="(max-width: 768px) 100vw, 50vw" />
  </div>
</section>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/hero.test.ts`
Expected: PASS.

- [ ] **Step 5: Wire the Home page**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../components/BaseLayout.astro';
import Hero from '../components/Hero.astro';
---
<BaseLayout>
  <Hero />
</BaseLayout>
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: build succeeds; `dist/index.html` produced.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add split-editorial Hero and wire Home page"
```

---

## Task 5: Gallery (masonry, optimized thumbnails + full-size URLs)

**Files:**
- Create: `src/components/Gallery.astro`
- Test: `tests/gallery.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/gallery.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/gallery.test.ts`
Expected: FAIL — cannot resolve `Gallery.astro`.

- [ ] **Step 3: Implement Gallery (CSS-columns masonry, no JS for layout)**

Create `src/components/Gallery.astro`:

```astro
---
import { Image, getImage } from 'astro:assets';
import { photos } from '../data/photos';

// Pre-generate an optimized large version of each image for the lightbox.
const fullImages = await Promise.all(
  photos.map((p) => getImage({ src: p.image, widths: [1600], format: 'webp' }))
);
---
<div class="columns-2 md:columns-3 gap-3 px-3 [&>*]:mb-3">
  {photos.map((photo, i) => (
    <button
      type="button"
      data-lightbox-item
      data-index={i}
      data-full={fullImages[i].src}
      data-alt={photo.alt}
      data-caption={photo.caption ?? ''}
      class="block w-full break-inside-avoid cursor-zoom-in"
      aria-label={`Open image: ${photo.alt}`}
    >
      <Image
        src={photo.image}
        alt={photo.alt}
        widths={[300, 500, 800]}
        sizes="(max-width: 768px) 50vw, 33vw"
        class="w-full h-auto"
        loading="lazy"
      />
    </button>
  ))}
</div>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/gallery.test.ts`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add masonry Gallery with optimized thumbnails and full-size URLs"
```

---

## Task 6: Lightbox navigation logic (pure module)

**Files:**
- Create: `src/lib/lightbox.ts`
- Test: `tests/lightbox.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lightbox.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/lightbox.test.ts`
Expected: FAIL — cannot resolve `../src/lib/lightbox`.

- [ ] **Step 3: Implement the pure navigation helpers**

Create `src/lib/lightbox.ts`:

```ts
/** Next index with wraparound. `count` is the total number of images. */
export function nextIndex(current: number, count: number): number {
  if (count <= 0) return 0;
  return (current + 1) % count;
}

/** Previous index with wraparound. */
export function prevIndex(current: number, count: number): number {
  if (count <= 0) return 0;
  return (current - 1 + count) % count;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/lightbox.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add pure lightbox index-navigation helpers with tests"
```

---

## Task 7: Lightbox component + Portfolio page

**Files:**
- Create: `src/components/Lightbox.astro`
- Create: `src/pages/portfolio.astro`

(This task is component + DOM wiring; verified by build + manual check rather than a unit test, since it is browser-event behavior. The navigation math it depends on is already tested in Task 6.)

- [ ] **Step 1: Implement the Lightbox overlay + wiring script**

Create `src/components/Lightbox.astro`:

```astro
---
// Renders a hidden overlay. The inline module script wires gallery buttons
// (rendered by Gallery.astro) to open/close/navigate the overlay.
---
<div
  id="lightbox"
  class="fixed inset-0 z-50 hidden items-center justify-center bg-black/90"
  role="dialog"
  aria-modal="true"
  aria-label="Image viewer"
>
  <button id="lb-close" class="absolute top-4 right-5 text-white text-3xl leading-none" aria-label="Close">&times;</button>
  <button id="lb-prev" class="absolute left-4 text-white text-4xl leading-none px-3 py-2" aria-label="Previous">&#8249;</button>
  <img id="lb-img" class="max-h-[90vh] max-w-[90vw] object-contain" alt="" />
  <button id="lb-next" class="absolute right-4 text-white text-4xl leading-none px-3 py-2" aria-label="Next">&#8250;</button>
</div>

<script>
  import { nextIndex, prevIndex } from '../lib/lightbox';

  const overlay = document.getElementById('lightbox')!;
  const imgEl = document.getElementById('lb-img') as HTMLImageElement;
  const items = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-lightbox-item]')
  );
  const count = items.length;
  let current = 0;

  function show(index: number) {
    current = index;
    const el = items[index];
    imgEl.src = el.dataset.full ?? '';
    imgEl.alt = el.dataset.alt ?? '';
  }

  function open(index: number) {
    show(index);
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
  }

  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  document.getElementById('lb-close')!.addEventListener('click', close);
  document.getElementById('lb-next')!.addEventListener('click', () => show(nextIndex(current, count)));
  document.getElementById('lb-prev')!.addEventListener('click', () => show(prevIndex(current, count)));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(nextIndex(current, count));
    if (e.key === 'ArrowLeft') show(prevIndex(current, count));
  });
</script>
```

- [ ] **Step 2: Wire the Portfolio page**

Create `src/pages/portfolio.astro`:

```astro
---
import BaseLayout from '../components/BaseLayout.astro';
import Gallery from '../components/Gallery.astro';
import Lightbox from '../components/Lightbox.astro';
---
<BaseLayout title="Portfolio — Sophie Martin">
  <h1 class="px-6 py-6 text-xs uppercase tracking-[0.25em] text-neutral-500">Portfolio</h1>
  <Gallery />
  <Lightbox />
</BaseLayout>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds; `dist/portfolio/index.html` produced.

- [ ] **Step 4: Manual smoke check**

Run: `npm run preview`
Open the previewed URL → go to `/portfolio` → click a photo (lightbox opens) → arrow keys / next-prev cycle → Esc closes.
Expected: all behaviors work.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Lightbox island and Portfolio page"
```

---

## Task 8: Contact validation + Contact page (Netlify Forms)

**Files:**
- Create: `src/lib/validateContact.ts`
- Create: `src/components/ContactForm.astro`
- Create: `src/pages/contact.astro`
- Test: `tests/validateContact.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/validateContact.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validateContact } from '../src/lib/validateContact';

describe('validateContact', () => {
  it('passes with a valid name, email, and message', () => {
    const result = validateContact({ name: 'Jane', email: 'jane@example.com', message: 'Hello there' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
  it('flags a missing name', () => {
    const result = validateContact({ name: '  ', email: 'jane@example.com', message: 'Hi' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
  });
  it('flags an invalid email', () => {
    const result = validateContact({ name: 'Jane', email: 'not-an-email', message: 'Hi' });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });
  it('flags an empty message', () => {
    const result = validateContact({ name: 'Jane', email: 'jane@example.com', message: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/validateContact.test.ts`
Expected: FAIL — cannot resolve `../src/lib/validateContact`.

- [ ] **Step 3: Implement the validator**

Create `src/lib/validateContact.ts`:

```ts
export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactInput, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: ContactInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!input.name || !input.name.trim()) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Please enter a valid email.';
  if (!input.message || !input.message.trim()) errors.message = 'Please enter a message.';
  return { valid: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/validateContact.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Implement ContactForm (Netlify Forms + AJAX submit + inline states)**

Create `src/components/ContactForm.astro`:

```astro
---
// Netlify detects the form at build time via the `data-netlify` attribute and
// the hidden `form-name` field. The script submits via fetch so we can show an
// inline success state without a full page navigation. `netlify-honeypot` traps bots.
---
<form
  name="contact"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  class="max-w-md flex flex-col gap-4"
  id="contact-form"
>
  <input type="hidden" name="form-name" value="contact" />
  <p class="hidden">
    <label>Don’t fill this out: <input name="bot-field" /></label>
  </p>

  <label class="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
    Name
    <input name="name" type="text" required class="border-b border-neutral-300 bg-transparent py-2 text-sm text-black focus:outline-none focus:border-black" />
    <span data-error="name" class="text-red-600 normal-case tracking-normal"></span>
  </label>

  <label class="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
    Email
    <input name="email" type="email" required class="border-b border-neutral-300 bg-transparent py-2 text-sm text-black focus:outline-none focus:border-black" />
    <span data-error="email" class="text-red-600 normal-case tracking-normal"></span>
  </label>

  <label class="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
    Message
    <textarea name="message" rows="5" required class="border border-neutral-300 bg-transparent py-2 px-2 text-sm text-black focus:outline-none focus:border-black"></textarea>
    <span data-error="message" class="text-red-600 normal-case tracking-normal"></span>
  </label>

  <button type="submit" class="self-start mt-2 px-6 py-3 text-xs uppercase tracking-[0.25em] border border-black hover:bg-black hover:text-white transition-colors">
    Send
  </button>

  <p data-success class="hidden text-sm text-green-700">Thank you — your message has been sent.</p>
</form>

<script>
  import { validateContact } from '../lib/validateContact';

  const form = document.getElementById('contact-form') as HTMLFormElement;
  const successEl = form.querySelector('[data-success]') as HTMLElement;

  function setError(field: string, msg: string) {
    const el = form.querySelector(`[data-error="${field}"]`) as HTMLElement | null;
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    form.querySelectorAll('[data-error]').forEach((el) => (el.textContent = ''));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const data = new FormData(form);
    const input = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    const { valid, errors } = validateContact(input);
    if (!valid) {
      for (const [field, msg] of Object.entries(errors)) setError(field, msg);
      return;
    }

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as any).toString(),
      });
      form.reset();
      successEl.classList.remove('hidden');
    } catch {
      setError('message', 'Something went wrong. Please email directly.');
    }
  });
</script>
```

- [ ] **Step 6: Wire the Contact page**

Create `src/pages/contact.astro`:

```astro
---
import BaseLayout from '../components/BaseLayout.astro';
import ContactForm from '../components/ContactForm.astro';
import { site } from '../data/site';
---
<BaseLayout title="Contact — Sophie Martin">
  <section class="px-6 py-10 md:px-16">
    <h1 class="text-xs uppercase tracking-[0.25em] text-neutral-500">Contact</h1>
    <p class="mt-6 max-w-md text-sm text-neutral-600">
      For bookings and enquiries, send a message below or reach out on social.
    </p>
    <div class="mt-8">
      <ContactForm />
    </div>
    <div class="mt-10 flex gap-5 text-xs uppercase tracking-[0.2em] text-neutral-500">
      {site.socials.map((s) => (
        <a href={s.href} class="hover:text-black" target="_blank" rel="noopener">{s.label}</a>
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 7: Run all tests and build**

Run: `npm test`
Expected: all suites PASS.
Run: `npm run build`
Expected: build succeeds; `dist/contact/index.html` produced.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add validated Netlify contact form and Contact page"
```

---

## Task 9: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Implement the 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../components/BaseLayout.astro';
---
<BaseLayout title="Page not found">
  <section class="px-6 py-24 text-center">
    <h1 class="text-2xl font-light tracking-[0.15em]">Page not found</h1>
    <p class="mt-4 text-sm text-neutral-500">
      The page you’re looking for doesn’t exist.
    </p>
    <a href="/" class="mt-8 inline-block text-xs uppercase tracking-[0.25em] underline underline-offset-4">Back home</a>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify the build emits the 404**

Run: `npm run build`
Expected: build succeeds; `dist/404.html` produced.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add styled 404 page"
```

---

## Task 10: Netlify deploy config + final verification

**Files:**
- Create: `netlify.toml`

- [ ] **Step 1: Add Netlify build config**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

- [ ] **Step 2: Full verification pass**

Run: `npm test`
Expected: all suites PASS.

Run: `npm run build`
Expected: build succeeds with no errors; `dist/` contains `index.html`, `portfolio/index.html`, `contact/index.html`, `404.html`.

- [ ] **Step 3: Manual responsive check**

Run: `npm run preview`
Check Home, Portfolio (lightbox), and Contact (validation errors + a successful submit attempt) at mobile and desktop widths.
Expected: layout holds; gallery is masonry; lightbox + form behave.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add Netlify deploy config"
```

- [ ] **Step 5: Deploy (when ready — requires the user's Netlify account)**

Connect the git repo to Netlify (or `npx netlify deploy --build --prod` after `netlify login`). Verify a test contact submission appears in the Netlify Forms dashboard, then attach the custom domain.

---

## Notes for the implementer

- **Placeholder content:** `src/data/site.ts` (name/intro/socials/email) and the images in `src/assets/` are placeholders. The user will replace the photos, name, and intro. Keep alt text required for every photo.
- **Netlify Forms caveat:** the form only actually records submissions once deployed to Netlify; locally the fetch POST will 404 harmlessly and the success state still shows. That's expected — real verification happens in Task 10, Step 5.
- **Changing the gallery layout later:** only `src/components/Gallery.astro` changes (swap the `columns-*` classes). Nothing else depends on the layout style.
