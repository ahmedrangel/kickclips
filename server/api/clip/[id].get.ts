export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  console.info(id);
  const data = await $fetch(`${RESOURCES.trigger}/api/kick/clip/${id}`).catch(() => null);
  return data;
});
