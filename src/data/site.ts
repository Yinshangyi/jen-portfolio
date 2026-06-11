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
