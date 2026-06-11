# Portfolio

A minimalist static portfolio site — Home, Portfolio (masonry gallery + lightbox), and Contact.

Built with [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com), deployed to [Netlify](https://www.netlify.com) (with Netlify Forms for the contact form).

## Develop

```bash
npm install
npm run dev      # local dev server
npm test         # run the Vitest suite
npm run build    # production build into dist/
npm run preview  # preview the built site
```

## Editing content

- **Photos:** drop image files into `src/assets/portfolio/`, then import them and add an entry in `src/data/photos.ts`. Display order is array order; every photo needs `alt` text. To change the gallery layout, edit only `src/components/Gallery.astro`.
- **Site text / links:** name, intro, contact email, and social links live in `src/data/site.ts`.
- **Hero image:** replace `src/assets/hero.jpg`.

> The committed name, photos, and links are placeholders — replace them with the real content before launch. Page `<title>`s in `src/pages/*.astro` also reference the placeholder name.

## Deploy

Connect the repo to Netlify (build config is in `netlify.toml`: `npm run build` → `dist/`). The contact form works once deployed — submissions appear in the Netlify Forms dashboard. Attach a custom domain in Netlify.
