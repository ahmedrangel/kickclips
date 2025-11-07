export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const config = useRuntimeConfig(event);
  const kickToken = config.kickToken;
  const data = await $fetch(`${RESOURCES.apiV2}/clips/${id}`, {
    headers: {
      "User-Agent": SITE.userAgent,
      "Authorization": `Bearer ${kickToken}`
    }
  }).catch(() => null);
  return data;
});
