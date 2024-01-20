import { INFO } from "~/utils/INFO";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  console.info(id);
  const response = await $fetch(`${INFO.kickApiBase}/clips/${id}`).catch(() => {
    throw createError({
      statusCode: 404,
      message: "Clip not found - Make sure you entered the correct URL"
    });
  });
  const data = JSON.parse(response);
  data.clip.clip_url = data.clip.clip_url.includes(".mp4") ? data.clip.clip_url : `${INFO.kickClipsTmp}/${id}.mp4`;
  await $fetch(data.clip.clip_url, { responseType: "blob" }).catch(async() => {
    const { url } = await $fetch(`${INFO.worker}/kick/clip/${id}`, { parseResponse: JSON.parse }).catch(() => ({}));
    if (!url) {
      throw createError({
        statusCode: 424,
        message: "The clip processing time was extended - Please try again"
      });
    }
    data.clip.clip_url = url;
  });
  return data;
});