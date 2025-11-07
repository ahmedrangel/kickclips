export default defineEventHandler(async (event): Promise<{ url: string } | null> => {
  const { url } = await readBody(event);
  const config = useRuntimeConfig(event);
  const kickToken = config.kickToken;
  const idRegex = /^https?:\/\/kick\.com\/[^\\/]+(?:\/clips\/(clip_\w+)|\?clip=(clip_\w+))(?:&.*|\?.*)?$/;
  const match = idRegex.exec(url);
  if (!match) return null;
  const id = match[1] || match[2];

  console.info(`Downloading clip URL: ${url}`);

  let triggerTmp;
  let retryCount = 0;
  const maxRetries = 5;
  const retryDelay = 500;
  while (!triggerTmp && retryCount < maxRetries) {
    triggerTmp = await $fetch<{ url: string }>(`${RESOURCES.apiV2}/clips/${id}/download`, {
      headers: {
        "User-Agent": SITE.userAgent,
        "Authorization": `Bearer ${kickToken}`
      }
    }).catch(() => null);
    if (!triggerTmp) {
      retryCount++;
      console.info(`Retrying download... Attempt ${retryCount}`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  if (triggerTmp?.url) {
    console.info("Downloaded using API v2");
    return { url: triggerTmp.url };
  }

  const worker = await $fetch<{ url: string }>(`${RESOURCES.worker}/kick/clip`, {
    query: { url }
  }).catch(() => null);

  if (worker?.url) {
    console.info("Downloaded using worker");
    return { url: worker.url };
  }

  return null;
});
