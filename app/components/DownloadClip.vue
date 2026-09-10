<script setup lang="ts">
const props = defineProps<{
  channel?: string;
  clipId?: string;
}>();
const url = ref<string>(props.channel && props.clipId ? `https://kick.com/${props.channel}/clips/${props.clipId}` : "");
const clip = ref<KickClipTypes | null>(null);
const loading = ref<boolean>(false);
const error = ref<{ message: string } | null>(null);

const getClipData = async () => {
  loading.value = true;
  error.value = null;
  if (clip.value?.blobURL) URL.revokeObjectURL(clip.value.blobURL);
  clip.value = await getClip(url.value).catch((e) => {
    error.value = e;
    loading.value = false;
    return null;
  }).finally(() => loading.value = false);
};

onMounted(async () => {
  if (props.channel && props.clipId) {
    await getClipData();
  }
});
</script>

<template>
  <div class="downloader-body justify-content-center mb-5 p-3 p-sm-4">
    <form @submit.prevent="getClipData()">
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
              <source :src="clip.blobURL" type="video/mp4">
            </video>
          </div>
          <div class="save">
            <a class="col-12 btn fw-bold mb-0" :href="clip.blobURL" target="_blank" :download="clip.filename">Save file</a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
