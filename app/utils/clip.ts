export const getClip = async (url: string): Promise<KickClipTypes> => {
  let blob: Blob | null;
  const match = kickRegex.exec(url);
  if (!match) {
    throw { message: "Error: The URL you entered is invalid" };
  }

  const id = match[1] || match[2] as string;
  const data = await $fetch<GetClipResponse>(`${RESOURCES.apiV2}/clips/${id}`).catch(() => null);

  if (!data?.clip) {
    throw { message: "Error: Clip not found - Make sure you entered the correct URL" };
  }

  const tmpVideo = await $fetch<Blob>(`${RESOURCES.clipsTmp}/${id}.mp4`).catch(() => null);

  if (!tmpVideo) {
    if (data?.clip.clip_url.includes(".mp4")) {
      blob = await $fetch<Blob>(data.clip.clip_url).catch(() => null);
    }
    else {
      const fromApi = await $fetch<{ url: string }>("/api/clip", { method: "POST", body: { url } }).catch(() => null);
      if (fromApi) blob = await $fetch<Blob>(fromApi?.url).catch(() => null);
      else {
        // Use @ffmpeg/mt-core as final fallback
        blob = data?.clip.clip_url.includes("/playlist.m3u8") ? await ffmpegProcess(data.clip.clip_url, id) : null;
      }
    }
  }
  else blob = tmpVideo;

  if (!blob) {
    throw { message: "Error: The clip processing time was extended - Please try again" };
  }

  const blobURL = URL.createObjectURL(blob);
  const picture = data?.clip.channel?.profile_picture ? data.clip.channel.profile_picture : "/images/user-default-pic.png";

  return {
    filename: data.clip.title + ".mp4",
    channel: data.clip.channel.username,
    slug: data.clip.channel.slug,
    channelPicture: picture,
    title: data.clip.title,
    views: data.clip.view_count,
    likes: data.clip.likes_count,
    blobURL: blobURL,
    creator: data.clip.creator.username,
    creatorSlug: data.clip.creator.slug,
    date: data.clip.created_at,
    duration: data.clip.duration
  };
};
