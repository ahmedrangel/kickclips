export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { id } = getRouterParams(event);
  const fd = await readFormData(event);
  fd.set("prefix", "tmp/videos/kick");
  fd.set("httpMetadata", JSON.stringify({
    "Content-Type": "video/mp4",
    "Content-Disposition": "inline",
    "Cache-Control": "public, max-age=86400"
  }));
  const file = fd.get("file");
  if (file instanceof File) {
    fd.set("file", new File([file], `${id}.mp4`, { type: "video/mp4" }));
  }
  if (!config.cdnToken || import.meta.dev) {
    return null;
  }

  const cdn = async () => {
    return await $fetch(`${RESOURCES.worker}/cdn`, {
      method: "PUT",
      headers: { "x-cdn-auth": config.cdnToken },
      body: fd
    }).catch(() => null);
  };

  event.waitUntil(cdn());
  return null;
});
