<script setup lang="ts">
import { useTimeAgo, useInfiniteScroll, watchDebounced } from "@vueuse/core";

const { params } = useRoute("channel");
const { query } = useRoute();
const { channel } = params;
const clips = ref<GetClipResponse["clip"][]>([]);
const username = ref<string>("");
const userimage = ref<string>("");
const { sort, time } = query as { sort?: SortOptions, time?: TimeOptions };
const element = useTemplateRef<HTMLElement>("element");

type SortOptions = "view" | "date";
type TimeOptions = "all" | "month" | "week" | "day";

const sortBy = ref<SortOptions>(sort || "view");
const timeBy = ref<TimeOptions>(time || "week");
const nextCursor = ref<string | null>();
const loading = ref<boolean>(false);
const searchQuery = ref<string>("");

const { data: response } = await useFetch(`/api/channel/${channel}/clips`, {
  query: {
    sort: sortBy.value,
    time: timeBy.value
  }
});

if (!response.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "This channel does not exist.",
    fatal: true
  });
}

clips.value = response.value?.clips || [];
nextCursor.value = response.value?.nextCursor || null;
username.value = response.value?.clips?.[0]?.channel?.username || "";
userimage.value = response.value?.clips?.[0]?.channel?.profile_picture || "";

const fetchClips = async () => {
  loading.value = true;
  const response = await $fetch<{ clips: GetClipResponse["clip"][], nextCursor: string }>(`${RESOURCES.apiV2}/channels/${channel}/clips`, {
    query: {
      sort: sortBy.value,
      time: timeBy.value,
      ...nextCursor.value && { cursor: nextCursor.value }
    },
    headers: { "Cache-Control": "no-cache" },
    parseResponse: JSON.parse
  }).catch(() => {
    loading.value = false;
    return null;
  });
  if (response?.clips && !nextCursor.value) {
    clips.value = response.clips;
  }
  else if (response?.clips) {
    // Append new clips to the existing list and filter duplicates por id
    clips.value = [...new Map([...clips.value, ...response.clips].map(clip => [clip.id, clip])).values()];
  }
  username.value = username.value || (response?.clips[0]?.channel?.username || "");
  userimage.value = userimage.value || (response?.clips[0]?.channel?.profile_picture || "");
  nextCursor.value = response?.nextCursor || null;
  loading.value = false;
};

watch([sortBy, timeBy], async () => {
  nextCursor.value = null;
  clips.value = [];
  await fetchClips();
  window.history.replaceState({}, "", `/${channel}?sort=${sortBy.value}&time=${timeBy.value}`);
});

useInfiniteScroll(window, async () => {
  if (!nextCursor.value) return;
  await fetchClips();
}, { distance: 100 });

const seoTitle = `${username.value} Clips`;
const seoUrl = `${SITE.url}/${channel.toLowerCase()}`;

useSeoMeta({
  title: `${seoTitle} | ${SITE.name}`,
  description: seoTitle,
  // Open Graph
  ogType: SEO.og.type as MaybeRef,
  ogTitle: seoTitle,
  ogDescription: seoTitle,
  ogUrl: seoUrl,
  ogImage: SEO.og.image,
  // Twitter
  twitterCard: SEO.twitter.card as MaybeRef,
  twitterTitle: seoTitle,
  twitterDescription: seoTitle
});

useHead({
  link: [
    { rel: "canonical", href: seoUrl }
  ]
});

const computedClips = computed(() => {
  return clips.value.filter((clip) => {
    const titleMatch = clip.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const usernameMatch = clip.creator.username.toLowerCase().includes(searchQuery.value.toLowerCase());
    return titleMatch || usernameMatch;
  });
});

watchDebounced([sortBy, timeBy, searchQuery], async () => {
  while (searchQuery.value && computedClips.value.length < 10 && nextCursor.value) {
    await fetchClips();
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}, { debounce: 1000 });
</script>

<template>
  <main class="text-white">
    <div class="text-center container overflow-hidden">
      <div class="my-5">
        <SearchChannelInput :align="'end'" class="mb-4" />
        <div class="mb-4">
          <NuxtLink to="/">
            <img class="logo" src="/images/kickclips-logo.svg">
          </NuxtLink>
        </div>
        <div class="d-flex justify-content-center align-items-center mb-2">
          <NuxtLink :to="`https://kick.com/${channel}`" target="_blank" external>
            <img :src="userimage || '/images/user-default-pic.png'" class="rounded-circle" width="60" height="60">
          </NuxtLink>
        </div>
        <h3 class="mb-4">{{ username || channel }} Clips</h3>
        <div class="d-flex flex-wrap justify-content-center gap-1 mb-4">
          <div class="d-flex flex-column align-items-center justify-content-center">
            <label>Sort by:</label>
            <select v-model="sortBy" class="form-select me-2" style="max-width: 150px;">
              <option value="view">Most Viewed</option>
              <option value="date">Latest</option>
            </select>
          </div>
          <div class="d-flex flex-column align-items-center justify-content-center">
            <label>Filter by:</label>
            <select v-model="timeBy" class="form-select" style="max-width: 150px;">
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="week">Last Week</option>
              <option value="day">Last Day</option>
            </select>
          </div>
          <div class="d-flex flex-column align-items-center justify-content-center" style="width: 240px;">
            <label>Search</label>
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search by title or username...">
          </div>
        </div>
        <div ref="element" class="row g-4">
          <div v-for="clip in computedClips" :key="clip.id" class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3" :title="clip?.title?.trim() || ''">
            <NuxtLink :to="`/?channel=${clip.channel.slug}&id=${clip.id}`" class="text-decoration-none text-white">
              <div class="card bg-dark text-white rounded-1 overflow-hidden">
                <div class="position-relative">
                  <img :src="clip.thumbnail_url" class="w-100">
                  <span class="badge bg-black position-absolute top-0 start-0 m-2 opacity-75">{{ formatTime(clip.duration) }}</span>
                  <span class="badge bg-black position-absolute bottom-0 start-0 m-2 opacity-75">
                    {{ formatViews(clip.view_count) }} views
                  </span>
                </div>
                <div class="card-body text-start d-flex flex-column gap-1 p-2">
                  <h6 class="card-title m-0 fw-bold text-truncate">{{ clip?.title?.trim() || "" }}</h6>
                  <small class="d-block card-text text-muted text-truncate">{{ clip?.category?.name?.trim() || "" }}</small>
                  <small class="d-block card-text text-muted text-truncate" :title="new Date(clip.created_at).toLocaleString()">{{ useTimeAgo(clip.created_at) }}</small>
                  <small class="d-flex card-text text-muted justify-content-start align-items-center gap-1">
                    <Icon name="ph:user-bold" />
                    <span class="text-truncate">{{ clip?.creator?.username?.trim() || "" }}</span>
                  </small>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        <template v-if="loading">
          <LoadingSpinner class="mt-4" text="Loading..." />
        </template>
      </div>
    </div>
  </main>
</template>
