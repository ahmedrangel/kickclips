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
        <img class="logo mb-4" src="/images/kickclips-logo.svg">
        <h3 class="mb-4">Kick Clips Downloader</h3>
        <h5 class="mb-4 fw-light mb-4">This is a free online tool for downloading MP4 clips from kick.com.</h5>
        <div class="row downloader-body justify-content-center mx-1 mb-5">
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
            <h5 v-else-if="error" class="error">The URL you entered is invalid</h5>
            <div v-else-if="clip.channel" id="clip" class="p-0">
              <div class="row">
                <div class="col-12 col-sm-4 info text-start mb-4">
                  <div class="channel_profile">
                    <img class="mb-1 img-fluid" :src="clip.channelPicture">
                    <a :href="`https://kick.com/${clip.slug}`" class="text-decoration-underline" target="_blank"><h3 class="mb-3 user">
                      {{ clip.channel }}</h3></a>
                    <h5 class="mb-3">{{ clip.title }}</h5>
                    <p>Likes:&nbsp;&nbsp;<span class="fw-light">{{ clip.likes }}</span></p>
                    <p>Views:&nbsp;&nbsp;<span class="fw-light">{{ clip.views }}</span></p>
                    <p>Duration:&nbsp;&nbsp;<span class="fw-light">{{ clip.duration }}</span></p>
                    <p>Clipped by: <a :href="`https://kick.com/${clip.creatorSlug}`" class="text-decoration-underline user" target="_blank">{{ clip.creator }}</a></p>
                    <p>Date:&nbsp;&nbsp;<span class="fw-light">{{ clip.date }}</span></p>
                  </div>
                </div>
                <div class="col-12 col-sm-8 video mb-4">
                  <video class="img-fluid" width="1280" height="720" controls>
                    <source :src="clip.videoUrl" type="video/mp4">
                  </video>
                </div>
                <div class="save">
                  <a class="col-12 btn fw-bold mb-0" :href="clip.videoUrl" target="_blank" :download="clip.filename">Save file</a>
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
<script>
  export default {
    data() {
      return {
        url: "",
        clip: {},
        loading: false,
        error: false,
      }
    },
    methods: {
      getDate (datetime) {
        const date = new Date(datetime);
        let d = date.getDate();
        let m = date.getMonth() + 1;
        const y = date.getFullYear();
        let hr = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        const amPm = hr >= 12 ? "PM" : "AM";
        hr = hr > 12 ? hr - 12 : hr;
        d = d.toString().padStart(2, "0");
        m = m.toString().padStart(2, "0");
        hr = hr.toString().padStart(2, "0");
        min = min.toString().padStart(2, "0");
        sec = sec.toString().padStart(2, "0");
        const formattedDate = `${y}-${m}-${d}, ${hr}:${min}:${sec} ${amPm}`;
        return formattedDate;
      },
      async getClip () {
        this.error = false;
        if (!(this.url.includes("kick.com/") && this.url.includes("?clip="))) {
          this.error = true;
          return;
        }
        if (this.clip.videoUrl) {
          URL.revokeObjectURL(this.clip.videoUrl);
        }
        const urlQ = new URL(this.url);
        const id = urlQ.searchParams.get("clip");
        this.loading = true;
        const blobber = "https://blobber.ahmedrangel.com";
        const response = await $fetch(`https://kick.com/api/v2/clips/${id}`).catch(() => ({}));
        const data = JSON.parse(response);
        console.log(data);
        this.clip = {
          filename: data.clip.id + ".mp4",
          channel: data.clip.channel.username,
          slug: data.clip.channel.slug,
          channelPicture: data.clip.channel.profile_picture,
          title: data.clip.title,
          views: data.clip.view_count,
          likes: data.clip.likes_count,
          videoUrl: await (async() => {
            const blob = await $fetch(`${blobber}/mp4?url=${encodeURIComponent(data.clip.video_url)}`).catch(() => ({}));;
            const url = URL.createObjectURL(blob);
            console.log(url);
            this.loading = false;
            return url;
          })(),
          creator: data.clip.creator.username,
          creatorSlug: data.clip.creator.slug,
          date: this.getDate(data.clip.created_at),
          duration: (() => {
            const durationSeconds = data.clip.duration;
            const minutes = (Math.floor(durationSeconds / 60)).toString().padStart(2, "0");;
            const seconds = (durationSeconds % 60).toString().padStart(2, "0");;
            const formattedTime = minutes + ":" + seconds;
            return formattedTime;
          })()
        };
      }
    }
  }
</script>
