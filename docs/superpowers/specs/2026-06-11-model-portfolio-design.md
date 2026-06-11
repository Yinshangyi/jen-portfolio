# Model Portfolio — Design Spec

**Date:** 2026-06-11
**Status:** Approved for planning

## Summary

A small, fast, static portfolio website for an amateur model (photos by her photographer
husband). Three pages — Home, Portfolio, Contact — in a minimalist, image-forward style
in the same genre as high-end model portfolios (clean, lots of white space, name as logo).
This is an original build inspired by that genre, not a copy of any specific site.

## Goals

- Showcase her photography work in a polished, professional-looking gallery.
- Be fast and clean despite being image-heavy (image optimization is a first-class concern).
- Be low-friction to update: drop a photo in a folder, add one entry, redeploy.
- Provide a real way to get in touch (working form + social links) with no backend to run.

## Non-Goals (YAGNI)

- No blog, no "Work"/client section, no coaching/services pages (reference site had these;
  we are deliberately trimming to Home / Portfolio / Contact).
- No CMS / visual admin — content is edited in code (user is technical and prefers this).
- No category filtering for the gallery — a single curated gallery for now. The gallery
  component is kept isolated so filtering or a layout change can be added later cheaply.
- No e-commerce, no analytics dashboard, no user accounts.

## Tech Stack

- **Framework:** Astro (static output, ships zero JS by default).
- **Styling:** Tailwind CSS.
- **Images:** Astro's built-in `<Image>` / asset pipeline — responsive sizes, modern
  formats (AVIF/WebP), lazy-loading.
- **Lightbox:** a lightweight gallery/lightbox interaction implemented as a single Astro
  client island (only the gallery page loads JS; other pages stay zero-JS).
- **Hosting:** Netlify, continuous deploy from the git repo.
- **Contact form:** Netlify Forms (no backend). Honeypot field for spam. Formspree noted
  as a host-agnostic fallback if the site ever leaves Netlify.
- **Domain:** custom domain attached via Netlify.

## Site Structure & Pages

Shared header (name-as-logo · Home · Portfolio · Contact) and footer (social icons).

1. **Home** — Split-editorial hero: a featured portrait on one side; her name + a short
   intro line on the other.
2. **Portfolio** — A single **masonry** gallery (photos keep natural heights, tile like
   Pinterest — forgiving of mixed portrait/landscape). Clicking any photo opens a
   full-screen lightbox with prev/next and keyboard navigation.
3. **Contact** — Working contact form (name, email, message) with validation and a
   success state, plus social/email links.

A simple 404 page reuses the shared layout.

## Components

Each component has one job, a clear interface, and can be reasoned about in isolation.

- **BaseLayout** — shared `<head>` (meta, fonts, SEO/OpenGraph tags), header/nav, and
  footer with social icons. Every page wraps in this.
  - Input: page title/description, slot for page content.
- **Hero** — homepage split-editorial block.
  - Input: featured image, name, intro text (from site config).
- **Gallery** — renders the masonry grid from a list of photo objects. All layout logic
  lives here, so changing the grid style later is a single-file change.
  - Input: ordered list of `{ image, alt, caption?, order }`.
  - Output: rendered grid; emits click events that open the Lightbox.
- **Lightbox** — full-screen image viewer: prev/next, keyboard (←/→/Esc), close.
  Implemented as the one JS island on the Portfolio page.
  - Input: the same photo list + the index that was clicked.
- **ContactForm** — Netlify Forms form with client-side validation, honeypot, and
  inline error + success states.

## Data / Content Model

- **Photos:** stored in an images folder; a single Astro **content collection** (or a
  typed `src/data/photos.ts` list) is the source of truth. Each entry:
  `{ image, alt, caption?, order }`. `Gallery` and `Lightbox` read this list.
- **Site config:** one file (`src/data/site.ts`) holds name, intro text, social URLs,
  contact email, and SEO defaults — edited in one place.

**Update workflow:** add image to folder → add one entry to the photo list → commit →
Netlify redeploys.

## Content the User Provides

(These are inputs, not unresolved design questions.)

- The model's name and a one-line intro (placeholder used until provided).
- The featured hero portrait.
- The gallery photos (with alt text).
- Social links + contact email.
- The custom domain.

## Error & Edge Handling

- **Contact form:** required-field validation, visible inline error messages, and a
  clear success/thank-you state after submit; honeypot to drop bots.
- **Gallery:** graceful empty state if no photos are present yet.
- **404:** simple not-found page in the shared layout.
- **Images:** every image requires alt text (accessibility + SEO); missing alt is a
  build-time/content error to catch early.

## Testing Strategy

- **Component checks:** Gallery renders the correct number of items from a given list;
  Lightbox opens on click and navigates prev/next; ContactForm blocks invalid input and
  shows the success state.
- **Build check:** `astro build` succeeds and an internal link check passes, so a broken
  build cannot deploy.
- **Manual pass:** responsive check (mobile/desktop) and a real test submission through
  Netlify Forms before launch.

## Deployment

- Git repo connected to Netlify; pushes to the main branch trigger a build + deploy.
- Custom domain + automatic HTTPS via Netlify.
- Netlify Forms enabled; verify a test submission reaches the dashboard/email.
