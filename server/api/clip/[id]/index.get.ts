import { RESOURCES } from "~/utils/INFO";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const data = await $fetch(`${RESOURCES.trigger}/api/kick/clip/${id}`).catch(() => null);
  return data;
});
