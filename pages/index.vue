<script setup>
  useSeoMeta({
    title: "KickClips | Kick Clip Downloader | Kick Clip to MP4"
  })
</script>
<template>
  <main class="text-white">
    <div class="text-center container">
      <div class="my-5">
        <h1 class="mb-4">Free Kick Clip Downloader</h1>
        <h5 class="mb-4 fw-light mb-4">This is a free online tool for downloading MP4 clips from kick.com.</h5>
        <div class="row downloader-body justify-content-center mx-1">
          <h2 class="col-12 fw-normal title mb-4">Enter clip URL</h2>
          <div class="col-12 row input-body p-2 mb-4">
            <input class="col-9 col-lg-10 col-sm-8" id="input" type="text" placeholder="https://kick.com/user?clip=123456">
            <button id="download" class="col-3 col-lg-2 col-sm-4 btn fw-bold d-flex align-items-center justify-content-center"><span class="iconify" data-icon="ph:download-simple-bold" data-inline="false"></span><span class="download-txt">Download</span></button>
          </div>
          <div id="clip" class="p-0"></div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
  export default {
    mounted() {
      const button = document.querySelector("#download");
      const input = document.querySelector("#input");
      const esUrl = (cadena) => {
        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
        return regex.test(cadena);
      };
      button.addEventListener("click", async() => {
        const value = input.value;
        if (esUrl(value) && value.includes("kick.com/") && value.includes("?clip=")) {
          const urlQ = new URL(value);
          const id = urlQ.searchParams.get("clip");
          const response = await fetch(`https://kick.com/api/v2/clips/${id}`);
          const data = await response.json();
          const channel = data.clip.channel.username;
          const slug = data.clip.channel.slug;
          const channelPicture = data.clip.channel.profile_picture;
          const title = data.clip.title;
          const views = data.clip.view_count;
          const likes = data.clip.likes_count;
          const videoUrl = data.clip.video_url;
          const creator = data.clip.creator.username;
          const creatorSlug = data.clip.creator.slug;
          const mp4Fetch = await fetch(videoUrl);
          const mp4Blob = await mp4Fetch.blob();
          console.log(mp4Blob);
          const blobUrl = URL.createObjectURL(mp4Blob);
          const filename = id + ".mp4";
          const html = `
          <div class="row">
              <div class="col-12 col-sm-4 info text-start mb-4">
                <div class="channel_profile">
                  <img class="mb-1 img-fluid" src="${channelPicture}">
                  <a href="https://kick.com/${slug}" class="text-decoration-none" target="_blank"><h3 class="mb-3 user">${channel}</h3></a>
                  <h5 class="mb-3">${title}</h5>
                  <p>Views: ${views}</p>
                  <p>Likes: ${likes}</p>
                  <div class="d-flex">
                    <p>Clipped by:</p>&nbsp;<a href="https://kick.com/${creatorSlug}" class="text-decoration-none" target="_blank"><p class="user">${creator}</p></a>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-8 video mb-4">
                <video class="img-fluid" width="1280" height="720" controls>
                  <source src="${videoUrl}" type="video/mp4">
                </video>
              </div>
              <div class="save">
                <a class="col-12 btn fw-bold mb-0" href="${blobUrl}" download="${filename}">Save file</a>
              </div>
            </div>
          `;
          document.querySelector("#clip").innerHTML = html;
        } else {
          const html = `<h5 class="error">The URL you entered is invalid</h5>`;
          document.querySelector("#clip").innerHTML = html;
        }
      });
    }
  }
</script>