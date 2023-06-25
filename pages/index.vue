<script setup>
  const seoDescription = "KickClips is a free online tool for downloading MP4 clips from kick.com.";
  const seoTitle = "KickClips | Downloader | to MP4";
  const seoUrl = "https://kickclips.ahmedrangel.com/";
  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    keywords: "kick, kick.com, kick clip, downloader, to mp4, mp4, download, clips, clipper",
    // Open Graph
    ogType: "website",
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogUrl: seoUrl,
    // Twitter
    twitterCard: "summary",
    twitterTitle: seoTitle,
    twitterDescription: seoDescription
  })
</script>
<template>
  <main class="text-white">
    <div class="text-center container">
      <div class="my-5">
        <h1 class="mb-4">Free Downloader</h1>
        <h5 class="mb-4 fw-light mb-4">This is a free online tool for downloading MP4 clips from kick.com.</h5>
        <div class="row downloader-body justify-content-center mx-1">
          <form @submit.prevent="getClip()">
            <h2 class="col-12 fw-normal title mb-4">Enter clip URL</h2>
            <div class="col-12 row input-body p-2 mb-4 mx-0">
              <input v-model="url" class="col-9 col-lg-10 col-sm-8" id="input" type="url" placeholder="https://kick.com/user?clip=123456" required>
              <button id="download" type="submit" class="col-3 col-lg-2 col-sm-4 btn fw-bold d-flex align-items-center justify-content-center">
                <Icon class="iconify" name="ph:download-simple-bold" />
                <span class="download-txt">Download</span>
              </button>
            </div>
          </form>
          <Transition name="tab" mode="out-in">
            <LoadingSpinner v-if="loading" />
            <template v-else-if="error" >
              <h5 class="error">The URL you entered is invalid</h5>
            </template>
            <template v-else>
              <div v-if="clip.channel" id="clip" class="p-0">
                <div class="row">
                  <div class="col-12 col-sm-4 info text-start mb-4">
                    <div class="channel_profile">
                      <img class="mb-1 img-fluid" :src="clip.channelPicture">
                      <a :href="`https://kick.com/${clip.slug}`" class="text-decoration-none" target="_blank"><h3 class="mb-3 user">
                        {{ clip.channel }}</h3></a>
                      <h5 class="mb-3">{{ clip.title }}</h5>
                      <p>Views: {{ clip.views }}</p>
                      <p>Likes: {{ clip.likes }}</p>
                      <div class="d-flex">
                        <p>Clipped by:</p>&nbsp;<a :href="`https://kick.com/${clip.creatorSlug}`" class="text-decoration-none" target="_blank"><p class="user">{{ clip.creator }}</p></a>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-8 video mb-4">
                    <video class="img-fluid" width="1280" height="720" controls>
                      <source :src="clip.videoUrl" type="video/mp4">
                    </video>
                  </div>
                  <div class="save">
                    <a class="col-12 btn fw-bold mb-0" :href="clip.videoUrl" target="_blank" download>Save file</a>
                  </div>
                </div>
              </div>
            </template>
          </Transition>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
  export default {
    data() {
      return {
        url: "",
        clip: {},
        loading: false,
        error: false
      }
    },
    methods: {
      async getClip () {
        this.error = false;
        if (!(this.url.includes("kick.com/") && this.url.includes("?clip="))) {
          this.error = true;
          return;
        }
        const urlQ = new URL(this.url);
        const id = urlQ.searchParams.get("clip");
        this.loading = true;
        const response = await $fetch(`https://kick.com/api/v2/clips/${id}`).catch(() => ({}));
        const data = JSON.parse(response);
        this.loading = false;
        this.clip = {
          channel: data.clip.channel.username,
          slug: data.clip.channel.slug,
          channelPicture: data.clip.channel.profile_picture,
          title: data.clip.title,
          views: data.clip.view_count,
          likes: data.clip.likes_count,
          videoUrl: data.clip.video_url,
          creator: data.clip.creator.username,
          creatorSlug: data.clip.creator.slug
        };
      }
    }
  }
</script>
