export const RESOURCES = {
  apiV2: "https://kick.com/api/v2",
  clipsTmp: "https://clips.kick.com/tmp",
  worker: "https://dev.ahmedrangel.com",
  cdn: "https://cdn.ahmedrangel.com/tmp/videos/kick"
};

export const SITE = {
  name: "KickClips",
  url: "https://kickclips.ahmedrangel.com",
  description: "KickClips is a free online tool for downloading MP4 clips from kick.com.",
  title: "KickClips | Downloader | to MP4",
  userAgent: "KickClips (Cloudflare Workers)"
};

export const SEO = {
  og: {
    type: "website",
    site_name: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/images/og-card.png`
  },
  twitter: {
    card: "summary",
    title: SITE.title,
    description: SITE.description
  }
};
