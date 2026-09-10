export const ffmpegProcess = async (playlist: string, id: string) => {
  const baseUrl = playlist.replace("/playlist.m3u8", "");
  const m3u8Data = await $fetch(playlist, { responseType: "text" }).catch(() => null) as string;
  const rangeRegex = /#EXT-X-BYTERANGE:(\d+)@(\d+)/g;
  const fileRegex = /(\w+\.ts)/g;

  const segments = Array.from(m3u8Data.matchAll(rangeRegex)).map(match => ({
    file: "",
    start: Number(match[2]),
    end: Number(match[2]) + Number(match[1])
  }));

  segments.forEach((segment, index) => {
    const match = m3u8Data.match(fileRegex);
    if (match) {
      const fileMatch = match[index];
      if (fileMatch) {
        const file = fileMatch.trim();
        segment.file = file;
      }
    }
  });

  const streams = await Promise.all<ReadableStream>(segments.map(async (seg) => {
    const rangeBytes = `bytes=${seg.start}-${seg.end}`;
    const response = await $fetch(`${baseUrl}/${seg.file}`, { responseType: "stream", headers: { Range: rangeBytes } }).catch(() => null);
    return response;
  }));

  const combinedStream = new ReadableStream({
    async start (controller) {
      for (const stream of streams) {
        if (stream) {
          const reader = stream.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        }
      }
      controller.close();
    }
  });

  const combinedBlob = await new Response(combinedStream).arrayBuffer();

  const { $ffmpeg } = useNuxtApp();
  const unpkg = "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm";
  try {
    $ffmpeg.on("log", ({ message }) => {
      console.info(message);
    });
    await $ffmpeg.load({
      coreURL: await $ffmpeg.toBlobURL(`${unpkg}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await $ffmpeg.toBlobURL(`${unpkg}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await $ffmpeg.toBlobURL(`${unpkg}/ffmpeg-core.worker.js`, "text/javascript")
    });
    console.info("FFmpeg loaded");
    await $ffmpeg.writeFile(`${id}.ts`, new Uint8Array(combinedBlob));
    console.info("File has been written");
    const timeout = await $ffmpeg.exec(["-i", `${id}.ts`, "-preset", "ultrafast", "-threads", "5", `${id}.mp4`], 120000);
    if (timeout) return null;
    console.info("Successful transformation");
    const data = await $ffmpeg.readFile(`${id}.mp4`) as BlobPart;
    console.info("File has been read");
    return new Blob([data], { type: "video/mp4" });
  }
  catch (e) {
    console.info(e);
    return null;
  }
};
