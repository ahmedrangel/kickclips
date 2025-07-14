<script setup lang="ts">
useSeoMeta({
  title: SITE.name,
  description: SITE.description,
  // Open Graph
  ogType: SEO.og.type as MaybeRef,
  ogTitle: SEO.og.title,
  ogDescription: SEO.og.description,
  ogUrl: SEO.og.url,
  ogImage: SEO.og.image,
  // Twitter
  twitterCard: SEO.twitter.card as MaybeRef,
  twitterTitle: SEO.twitter.title,
  twitterDescription: SEO.twitter.description
});

useHead({
  link: [
    { rel: "canonical", href: SITE.url }
  ],
  script: [{
    type: "application/ld+json",
    innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE.name,
      "url": SITE.url
    })
  }]
});

const { query } = useRoute();
const queryParams = query as { channel?: string, id: string };
</script>

<template>
  <main class="text-white">
    <div class="text-center container overflow-hidden">
      <div class="my-5">
        <SearchChannelInput :align="'end'" class="mb-4" />
        <img class="logo mb-4" src="/images/kickclips-logo.svg">
        <h3 class="mb-4">Kick Clips Downloader</h3>
        <h5 class="mb-4 fw-light mb-4">This is a free online tool for downloading MP4 clips from kick.com.</h5>
        <DownloadClip :channel="queryParams.channel" :clip-id="queryParams.id" />
        <DownloadGuide />
      </div>
    </div>
  </main>
</template>
