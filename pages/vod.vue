<template>
  <main class="text-white">
    <div class="container my-5 text-center">
      <img class="logo mb-4" src="/images/kickclips-logo.svg">
      <h3 class="mb-4">Kick VOD Segments Extractor (Beta)</h3>
      <h5 class="mb-4 fw-light mb-4">This is a free online tool for extracting VOD's segments from kick.com videos.</h5>
      <div class="row downloader-body justify-content-center mx-1 mb-5 text-start">
        <form @submit.prevent="getVod()">
          <h2 class="col-12 fw-normal title mb-4">Enter VOD/Video URL</h2>
          <div class="col-12 row input-body p-2 mb-4 mx-0">
            <input id="input" v-model="url" class="col-9 col-lg-10 col-sm-8" type="url" placeholder="https://kick.com/video/1abc2345-6d7e-8901-fab2-345c6d789f01" required>
            <button id="download" type="submit" class="col-3 col-lg-2 col-sm-4 btn fw-bold d-flex align-items-center justify-content-center">
              <Icon class="iconify" name="bi:chevron-double-down" />
              <span class="ms-1 download-txt">Submit</span>
            </button>
          </div>
        </form>
      </div>
      <LoadingSpinner v-if="loading_vod" />
      <h5 v-else-if="error" class="error">The URL you entered is invalid</h5>
      <div v-else-if="master" class="row downloader-body mx-1 mb-5">
        <div class="row">
          <div class="col-12 col-sm-5 info text-start mb-3">
            <div class="channel_profile">
              <img class="mb-1 img-fluid" :src="allInfo.channelPicture">
              <a :href="`https://kick.com/${allInfo.slug}`" class="text-decoration-underline" target="_blank"><h3 class="mb-3 user">
                {{ allInfo.channel }}</h3></a>
              <h5 class="mb-3">{{ allInfo.title }}</h5>
              <p class="mb-3">Date:&nbsp;&nbsp;<span class="fw-light">{{ getDate(allInfo.date) }}</span></p>
            </div>
          </div>
          <div class="col-12 col-sm-7 video mb-3">
            <img class="img-fluid" width="1280" height="720" :src="allInfo.thumbnail">
          </div>
        </div>
        <form class="text-start" @submit.prevent="getDownload()">
          <h5 class="mb-3">Available video formats:</h5>
          <select v-model="quality" class="select mb-3 fw-bold">
            <option v-for="(formats, index) of allInfo.playlists" :key="index" class="formats">{{ formats.quality }}</option>
          </select>
          <div class="range-slider col-12">
            <input v-model="sliderMin" type="range" min="0" :max="duration" step="0">
            <input v-model="sliderMax" type="range" min="0" :max="duration" step="0">
            <input v-model="sliderMin" type="number" min="0" :max="duration" step="0" style="display:none;">
            <input v-model="sliderMax" type="number" min="0" :max="duration" step="0" style="display:none;">
            <div class="d-inline-flex gap-3 text-center align-items-center">
              <div class="d-inline-flex gap-2 align-items-end">
                <h5 class="m-0 align-self-center py-1">Start Time:</h5>
                <h5 class="m-0 bg-time">{{ getTimeByMs(minAngle) }}</h5>
              </div>
              <div class="d-inline-flex gap-2 align-items-end">
                <h5 class="m-0 align-self-center py-1">End Time:</h5>
                <h5 class="m-0 bg-time">{{ getTimeByMs(maxAngle) }}</h5>
              </div>
            </div>
          </div>
          <div class="input-vod d-inline-flex mt-5">
            <button id="download" class="btn d-flex align-items-center" type="submit">
              <LoadingSpinner v-if="loading" /><Icon v-else class="iconify" name="ph:download-simple-bold" />
              <span v-if="loading">&nbsp;</span>
              <h5 class="download-txt mb-0">&nbsp;<b>Start Download</b></h5>
            </button>
            <a v-if="videoUrl" v-bind="fakeClick()" id="attachment" :href="videoUrl" :download="`${title}.ts`" hidden>link</a>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script>

export default {
  data () {
    return {
      url: "",
      title: "",
      error: false,
      maxRange: 600000,
      minAngle: 0,
      maxAngle: 600000,
      duration: 600000,
      server: "https://tn2.ahmedrangel.com",
      master: "",
      quality: "",
      videoUrl: null,
      loading_vod: false,
      loading: false,
      allInfo: {}
    };
  },
  computed: {
    sliderMin: {
      get: function() {
        const val = parseInt(this.minAngle);
        return val;
      },
      set: function(val) {
        val = parseInt(val);
        if (val < this.maxAngle - this.maxRange) {
          this.maxAngle = val + this.maxRange;
        } else if (val > this.maxAngle) {
          this.maxAngle = val;
        }
        this.minAngle = val;
      }
    },
    sliderMax: {
      get: function() {
        const val = parseInt(this.maxAngle);
        return val;
      },
      set: function(val) {
        val = parseInt(val);
        if (val > this.minAngle + this.maxRange) {
          this.minAngle = val - this.maxRange;
        } else if (val < this.minAngle) {
          this.minAngle = val;
        }
        this.maxAngle = val;
      }
    }
  },
  methods: {
    async getVod () {
      const server = this.server;
      const vodId = getUrlId(this.url);
      this.error = false;
      if (!(this.url.includes("kick.com/") && this.url.includes("/video/"))) {
        this.error = true;
        return;
      }
      this.loading_vod = true;
      const kickF = await fetch(`https://kick.com/api/v1/video/${vodId}`);
      const kickR = await kickF.json();
      this.title = kickR.livestream.session_title;
      this.master = kickR.source;
      const generalF = await fetch(`https://kick.com/api/v1/channels/${kickR.livestream.channel.slug}`);
      const generalR = await generalF.json();
      const thumbnail = [];
      generalR.previous_livestreams.forEach(el => {
        if (kickR.live_stream_id == el.id) {
          thumbnail.push(el.thumbnail.src);
        }
      });

      const getQ = await fetch(`${server}/qualities?master=${this.master}`);
      const qualities = await getQ.text();
      const jsonQ = JSON.parse(qualities);
      const playlist = jsonQ[0].playlist;
      const getPlayInfo = await fetch(`${server}/playlist?url=${playlist}`);
      const infoR = await getPlayInfo.text();
      const jsonInfo = JSON.parse(infoR);

      this.allInfo = {
        channel: kickR.livestream.channel.user.username,
        slug: kickR.livestream.channel.slug,
        title: this.title,
        date: kickR.created_at,
        channelPicture: kickR.livestream.channel.user.profilepic,
        thumbnail: thumbnail[0],
        master: this.master,
        segments: jsonInfo.segments,
        duration: jsonInfo.duration,
        playlists: jsonQ.reverse()
      };

      console.info(this.allInfo);
      this.duration = this.allInfo.duration;
      this.loading_vod = false;
    },
    async getDownload () {
      this.loading = true;
      const msStart = encodeURIComponent(getTimeByMs(this.minAngle));
      const segmentEnd = Math.ceil(this.maxAngle / 12500);
      const blobF = await fetch(`${this.server}/vod?master=${this.master}&quality=${this.quality}&start=${msStart}&end=${segmentEnd}`);
      const blob = await blobF.blob();
      this.loading = false;
      this.videoUrl = URL.createObjectURL(blob);
      console.info(this.videoUrl);
    },
    fakeClick () {
      setTimeout(() => {
        document.querySelector("#attachment").click();
        URL.revokeObjectURL(this.videoUrl);
        this.videoUrl = null;
      }, 500);
    }
  }
};
</script>
