export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;
  const { href: reqURL } = getRequestURL(event);
  let cacheManager = {
    cache: null as any,
    cacheKey: null as Request | null
  };

  // Check cache
  if (!import.meta.dev) {
    const cacheKey = new Request(reqURL, cloudflare.req);
    // @ts-expect-error
    const cache = caches.default;
    cacheManager = { cache, cacheKey };
    const response = await cache.match(cacheKey);

    if (response) {
      console.info("Found in cache!");
      return response;
    }
  }

  const { url }: { url: string } = getQuery(event);
  const data = await $fetch.raw(url).catch(() => null);
  const body = data?._data as BodyInit;
  const contentType = data?.headers.get("content-type");
  const response = new Response(body, {
    headers: {
      "Content-Type": contentType || "image/webp",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "max-age=172800" // 12h cache
    }
  });

  if (body && !import.meta.dev) {
    console.info("Stored in cache!");
    cloudflare.context.waitUntil(cacheManager.cache.put(cacheManager.cacheKey, response.clone()));
  }

  return response;
});
