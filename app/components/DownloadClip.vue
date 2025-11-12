<script setup lang="ts">
const props = defineProps<{
  channel?: string;
  clipId?: string;
}>();
const url = ref<string>(props.channel && props.clipId ? `https://kick.com/${props.channel}/clips/${props.clipId}` : "");
const clip = ref<KickClipTypes | null>(null);
const loading = ref<boolean>(false);
const error = ref<{ message: string } | null>(null);
const blob = ref<Blob | null>(null);
const blobUrl = ref<string | null>(null);

const getClip = async () => {
  error.value = null;
  const idRegex = /^https?:\/\/kick\.com\/[^\\/]+(?:\/clips\/(clip_\w+)|\?clip=(clip_\w+))(?:&.*|\?.*)?$/;
  const match = idRegex.exec(url.value);
  if (!match) {
    error.value = { message: "Error: The URL you entered is invalid" };
    return;
  }

  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value);
  }

  const id = match[1] || match[2] as string;
  loading.value = true;
  const data = await $fetch<GetClipResponse>(`${RESOURCES.apiV2}/clips/${id}`).catch(() => null);

  if (!data?.clip) {
    loading.value = false;
    error.value = { message: "Error: Clip not found - Make sure you entered the correct URL" };
    return;
  }

  const tmpVideo = await $fetch<Blob>(`${RESOURCES.clipsTmp}/${id}.mp4`).catch(() => null) || await $fetch<Blob>(`${RESOURCES.cdn}/${id}.mp4?t=${Date.now()}`).catch(() => null);

  if (!tmpVideo) {
    if (data?.clip.clip_url.includes(".mp4")) {
      blob.value = await $fetch<Blob>(data.clip.clip_url).catch(() => null);
    }
    else {
      const fromApi = await $fetch<{ url: string }>("/api/clip", { method: "POST", body: { url: url.value } }).catch(() => null);
      if (fromApi) blob.value = await $fetch<Blob>(fromApi?.url).catch(() => null);
      else {
        blob.value = data?.clip.clip_url.includes("/playlist.m3u8") ? await processClip(data.clip.clip_url, id) : null;
        if (blob.value) {
          const fd = new FormData();
          fd.append("file", blob.value, `${id}.mp4`);
          await $fetch("/api/cdn", { method: "PUT", body: fd }).catch(() => null);
        }
      }
    }
  }
  else blob.value = tmpVideo;

  if (!blob.value) {
    loading.value = false;
    error.value = { message: "Error: The clip processing time was extended - Please try again" };
    return;
  }

  blobUrl.value = URL.createObjectURL(blob.value);
  const picture = data?.clip.channel?.profile_picture ? data.clip.channel.profile_picture : "/images/user-default-pic.png";

  loading.value = false;

  clip.value = {
    filename: data.clip.title + ".mp4",
    channel: data.clip.channel.username,
    slug: data.clip.channel.slug,
    channelPicture: picture,
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

if (props.channel && props.clipId) getClip();
</script>

<template>
  <div class="downloader-body justify-content-center p-3 p-sm-4">
    <form @submit.prevent="getClip()">
      <h2 class="col-12 fw-normal title mb-3 mb-sm-4">Enter clip URL</h2>
      <div class="col-12 row input-body p-2 mb-3 mb-sm-4 mx-0 flex-nowrap">
        <input id="input" v-model="url" class="col-9 col-lg-10 col-sm-8" type="url" placeholder="https://kick.com/user/clips/clip_01A2BCD3EF4GHI5JKMNLOP67QR" required>
        <button id="download" v-ripple type="submit" class="col-3 col-lg-2 col-sm-4 btn fw-bold d-flex align-items-center justify-content-center" :disabled="loading ? true : false">
          <Icon name="ph:download-simple-bold" size="1.8em" />
          <span class="ms-1 download-txt">Download</span>
        </button>
      </div>
    </form>
    <Transition name="tab" mode="out-in">
      <LoadingSpinner v-if="loading" />
      <h5 v-else-if="error" class="error">{{ error.message }}</h5>
      <div v-else-if="clip?.channel" id="clip" class="p-0">
        <div class="row">
          <div class="col-12 col-lg-4 info text-start mb-4">
            <div class="channel_profile">
              <img class="mb-1 img-fluid" :src="clip.channelPicture">
              <a :href="`https://kick.com/${clip.slug}`" class="text-decoration-underline" target="_blank">
                <h3 class="mb-3">
                  {{ clip.channel }}
                </h3>
              </a>
              <h5 class="mb-3">{{ clip.title }}</h5>
              <div class="clip_info d-flex gap-2 align-items-center">
                <Icon name="ph:heart-fill" />
                <p><span class="fw-bold">{{ clip.likes }}</span></p>
                <p>likes</p>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <Icon name="ph:eye-bold" />
                <p><span class="fw-bold">{{ clip.views }}</span></p>
                <p>views</p>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <Icon name="ph:clock-bold" />
                <p><span class="fw-bold">{{ formatTime(clip.duration) }}</span></p>
                <p>duration</p>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <Icon name="ph:user-bold" />
                <p><a :href="`https://kick.com/${clip.creatorSlug}`" class="text-decoration-underline" target="_blank">{{ clip.creator }}</a></p>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <Icon name="ph:calendar-bold" />
                <p><span>{{ getDate(clip.date) }}</span></p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-8 video mb-4">
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
</template>
