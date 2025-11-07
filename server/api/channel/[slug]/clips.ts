export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);
  const { sort, time } = getQuery(event);
  const config = useRuntimeConfig(event);
  const kickToken = config.kickToken;
  const data = await $fetch<{ clips: GetClipResponse["clip"][], nextCursor: string }>(`${RESOURCES.apiV2}/channels/${slug}/clips`, {
    query: { sort, time },
    headers: {
      "User-Agent": SITE.userAgent,
      "Authorization": `Bearer ${kickToken}`
    }
  }).catch(() => null);
  return data;
});
