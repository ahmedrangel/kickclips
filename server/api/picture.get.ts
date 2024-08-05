export default defineEventHandler(async (event) => {
  const { url }: { url: string } = getQuery(event);
  const data = await $fetch(url).catch(() => null) as Blob;
  return data;
});
