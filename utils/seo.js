const info = {
  description: "KickClips is a free online tool for downloading MP4 clips from kick.com.",
  title: "KickClips | Downloader | to MP4",
  url: "https://kickclips.ahmedrangel.com",
  keywords: "kick, kick.com, kick clip, downloader, to mp4, mp4, download, clips, clipper, video"
};

export const SEO = {
  description: info.description,
  title: info.title,
  url: info.url,
  keywords: info.keywords,
  og: {
    type: "website",
    title: info.title,
    description: info.description,
    url: info.url,
    image: `${info.url}/images/og-card.png`,
  },
  twitter: {
    card: "summary",
    title: info.title,
    description: info.description,
  }
};