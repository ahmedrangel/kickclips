export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;
  const config = useRuntimeConfig(event);
  const fd = await readFormData(event);
  fd.append("prefix", "tmp/videos/kick");
  fd.append("httpMetadata", JSON.stringify({
    "Content-Type": "video/mp4",
    "Content-Disposition": "inline",
    "Cache-Control": "public, max-age=86400"
  }));

  const cdn = async () => {
    return await $fetch(`${RESOURCES.worker}/cdn`, {
      method: "PUT",
      headers: { "x-cdn-auth": config.cdnToken },
      body: fd
    }).catch(() => null);
  };

  if (import.meta.dev) {
    return cdn();
  }

  cloudflare.context.waitUntil(cdn());
  return null;
});
