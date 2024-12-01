import { RESOURCES } from "~/utils/INFO";

export default defineEventHandler(async (event): Promise<{ url: string } | null> => {
  const { url } = await readBody(event);
  const idRegex = /^https?:\/\/kick\.com\/[^\\/]+(?:\/clips\/(clip_\w+)|\?clip=(clip_\w+))$/;
  const match = idRegex.exec(url);
  if (!match) return null;
  const id = match[1] || match[2];

  const triggerTmp = await $fetch(`${RESOURCES.trigger}/api/kick/clip/${id}/download`).catch(() => null) as { url: string };
  if (triggerTmp?.url) return { url: triggerTmp.url };

  const worker = await $fetch(`${RESOURCES.worker}/kick/clip`, {
    query: { url }
  }).catch(() => null) as { url: string };
  if (worker?.url) return { url: worker.url };

  return null;
});
