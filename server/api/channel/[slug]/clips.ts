export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);
  const { sort, time } = getQuery(event);
  const data = await $fetch<{ clips: GetClipResponse["clip"][], nextCursor: string }>(`${RESOURCES.apiV2}/channels/${slug}/clips`, {
    query: { sort, time },
    parseResponse: JSON.parse
  }).catch(() => null);
  return data;
});
