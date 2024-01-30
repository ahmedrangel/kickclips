import { SITE } from "./info";

export const SEO = {
  og: {
    type: "website",
    title: SITE.title,
    description: SITE.description,
    url: SITE.host,
    image: `${SITE.host}/images/og-card.png`,
  },
  twitter: {
    card: "summary",
    title: SITE.title,
    description: SITE.description,
  }
};