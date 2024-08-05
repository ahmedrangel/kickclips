<script setup lang="ts">
useSeoMeta({
  title: SITE.name,
  description: SITE.description,
  keywords: SITE.keywords,
  // Open Graph
  ogType: SEO.og.type as MaybeRef,
  ogTitle: SEO.og.title,
  ogSiteName: SEO.og.site_name,
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
    { rel: "canonical", href: SITE.host }
  ]
});

const url = ref<string>("");
const clip = ref<Record<string, string>>({});
const loading = ref<boolean>(false);
const error = ref<{ message: string } | null>(null);
const blob = ref<Blob | null>(null);
const blobUrl = ref<string | null>(null);

const getClip = async () => {
  error.value = null;
  if (!(url.value.includes("kick.com/") && url.value.includes("?clip="))) {
    error.value = { message: "Error: The URL you entered is invalid" };
    return;
  }

  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value);
  }

  const urlQ = new URL(url.value);
  const id = urlQ.searchParams.get("clip");
  loading.value = true;
  const data = await $fetch(`${RESOURCES.kickApiBase}/clips/${id}`, { parseResponse: JSON.parse }).catch(() => {
    loading.value = false;
    error.value = { message: "Error: Clip not found - Make sure you entered the correct URL" };
    return;
  }) as Record<string, any>;

  const possibleTmp = `${RESOURCES.kickClipsTmp}/${id}.mp4`;
  const tmpVideo = await $fetch(possibleTmp).catch(() => null) as Blob;

  if (!tmpVideo) {
    if (data.clip.clip_url.includes(".mp4")) {
      blob.value = await $fetch(data.clip.clip_url).catch(() => null) as Blob;
    }
    else {
      const fromApi = await $fetch(`/api/clip/${id}`, { method: "POST" }).catch(() => null) as { url: string };
      blob.value = await $fetch(fromApi?.url).catch(() => null) as Blob;
    }
  }
  else {
    blob.value = tmpVideo;
  }

  if (!blob.value) {
    loading.value = false;
    error.value = { message: "Error: The clip processing time was extended - Please try again" };
    return;
  }

  blobUrl.value = URL.createObjectURL(blob.value);

  loading.value = false;
  clip.value = {
    filename: data.clip.title + ".mp4",
    channel: data.clip.channel.username,
    slug: data.clip.channel.slug,
    channelPicture: data.clip.channel.profile_picture ?? "/images/user-default-pic.png",
    title: data.clip.title,
    views: data.clip.view_count,
    likes: data.clip.likes_count,
    blob: blobUrl.value,
    creator: data.clip.creator.username,
    creatorSlug: data.clip.creator.slug,
    date: data.clip.created_at,
    duration: data.clip.duration
  };
};
</script>

<template>
  <main class="text-white">
    <div class="text-center container overflow-hidden">
      <div class="my-5">
        <img class="logo mb-4" src="/images/kickclips-logo.svg">
        <h3 class="mb-4">Kick Clips Downloader</h3>
        <h5 class="mb-4 fw-light mb-4">This is a free online tool for downloading MP4 clips from kick.com.</h5>
        <div class="row downloader-body justify-content-center mx-1 mb-5">
          <form @submit.prevent="getClip()">
            <h2 class="col-12 fw-normal title mb-4">Enter clip URL</h2>
            <div class="col-12 row input-body p-2 mb-4 mx-0">
              <input id="input" v-model="url" class="col-9 col-lg-10 col-sm-8" type="url" placeholder="https://kick.com/user?clip=clip_01A2BCD3EF4GHI5JKMNLOP67QR" required>
              <button id="download" type="submit" class="col-3 col-lg-2 col-sm-4 btn fw-bold d-flex align-items-center justify-content-center" :disabled="loading ? true : false">
                <Icon class="iconify" name="ph:download-simple-bold" />
                <span class="ms-1 download-txt">Download</span>
              </button>
            </div>
          </form>
          <Transition name="tab" mode="out-in">
            <LoadingSpinner v-if="loading" />
            <h5 v-else-if="error" class="error">{{ error.message }}</h5>
            <div v-else-if="clip.channel" id="clip" class="p-0">
              <div class="row">
                <div class="col-12 col-sm-4 info text-start mb-4">
                  <div class="channel_profile">
                    <img class="mb-1 img-fluid" :src="clip.channelPicture">
                    <a :href="`https://kick.com/${clip.slug}`" class="text-decoration-underline" target="_blank">
                      <h3 class="mb-3 user">
                        {{ clip.channel }}
                      </h3>
                    </a>
                    <h5 class="mb-3">{{ clip.title }}</h5>
                    <p>Likes:&nbsp;&nbsp;<span class="fw-light">{{ clip.likes }}</span></p>
                    <p>Views:&nbsp;&nbsp;<span class="fw-light">{{ clip.views }}</span></p>
                    <p>Duration:&nbsp;&nbsp;<span class="fw-light">{{ formatTime(clip.duration) }}</span></p>
                    <p>Clipped by: <a :href="`https://kick.com/${clip.creatorSlug}`" class="text-decoration-underline user" target="_blank">{{ clip.creator }}</a></p>
                    <p>Date:&nbsp;&nbsp;<span class="fw-light">{{ getDate(clip.date) }}</span></p>
                  </div>
                </div>
                <div class="col-12 col-sm-8 video mb-4">
                  <video class="img-fluid" width="1280" height="720" controls autoplay muted>
                    <source :src="clip.blob" type="video/mp4">
                  </video>
                </div>
                <div class="save">
                  <a class="col-12 btn fw-bold mb-0" :href="clip.blob" target="_blank" :download="clip.filename">Save file</a>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <div class="guide-body mx-1">
          <h3 class="mb-4">How to download a Kick clip?</h3>
          <div class="row g-4">
            <div class="col-12 col-lg-4">
              <div class="guide p-4">
                <h1><Icon class="iconify" name="ph:film-slate-duotone" /></h1>
                <h5>Step 1: Get clip URL</h5>
                <h5 class="fw-light mb-3">On the Kick.com website, search for the clip you wish to download, press the share button, and then copy the clip's URL.</h5>
                <img class="img-fluid" src="/images/example.png">
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="guide p-4">
                <h1><Icon class="iconify" name="uiw:copy" /></h1>
                <h5>Step 2: Paste clip URL</h5>
                <h5 class="fw-light">Simply paste the URL into the designated text box on Kickclips, and proceed by clicking the <b>"Download"</b> button.</h5>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="guide p-4">
                <h1><Icon class="iconify" name="ph:download-simple-duotone" /></h1>
                <h5>Step 3: Download MP4 clip</h5>
                <h5 class="fw-light">After obtaining the video, you can easily download it by simply <b>right-clicking</b> on the displayed video and selecting <b>"Save video as"</b> or, click on the <b>"Save File"</b> button to initiate the direct download.</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
