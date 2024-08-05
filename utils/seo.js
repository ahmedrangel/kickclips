import { SITE } from "./INFO";

export const SEO = {
  og: {
    type: "website",
    site_name: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.host,
    image: `${SITE.host}/images/og-card.png`
  },
  twitter: {
    card: "summary",
    title: SITE.title,
    description: SITE.description
  }
};
