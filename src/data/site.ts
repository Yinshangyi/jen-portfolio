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
  name: 'Jenny De Jaeger',
  tagline: 'Model',
  intro:
    'Project manager in tech and dancer, modeling for the love of it. Based in Paris and available for photoshoots.',
  email: 'jenazareno21@gmail.com',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/iam.jennydejaeger/' },
    { label: 'Tiktok', href: 'https://www.tiktok.com/@jennydj2191/' },
    { label: 'Email', href: 'mailto:jenazareno21@gmail.com' },
  ],
  seoDescription:
    'Portfolio of Jenny De Jaeger — model, project manager in tech, and dancer. Editorial and portrait photography.',
};
