import { RESOURCES } from "~/utils/INFO";

export default defineEventHandler(async (event): Promise<{ url: string } | null> => {
  const { id } = getRouterParams(event);
  const triggerTmp = await $fetch(`${RESOURCES.trigger}/api/kick/clip/${id}`).catch(() => null) as { url: string };
  if (triggerTmp?.url) return { url: triggerTmp.url };

  const crossClip = await $fetch(`${RESOURCES.worker}/kick/clip/${id}`).catch(() => null) as { url: string };
  if (crossClip?.url) return { url: crossClip.url };

  return null;
});
