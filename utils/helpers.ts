export const formatTime = (durationSeconds: number) => {
  const minutes = (Math.floor(durationSeconds / 60)).toString().padStart(2, "0");
  const seconds = (durationSeconds % 60).toString().padStart(2, "0");
  const formattedTime = minutes + ":" + seconds;
  return formattedTime;
};

export const getDate = (datetime: string) => {
  const date = new Date(datetime);
  const isoDate = date.toISOString().split("T")[0];
  const time = date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formattedDate = `${isoDate}, ${time}`;
  return formattedDate;
};

export const getTimeByMs = (seconds: number) => {
  const time = new Date(Math.ceil(seconds / 12500) * 12500).toISOString().slice(11, -5);
  return time;
};

export const getUrlId = (url: string) => {
  const regex = /\/([a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9]+)?(?:\?|$|\/\?|\/$)/;
  const result = regex.exec(url);
  return (result && result.length > 1) ? result[1] : null;
};

export const minutesOrHours = (minutes: number) => {
  if (minutes < 60) {
    return minutes === 1 ? minutes + " minute" : minutes + " minutes";
  }
  else {
    const hours = Math.floor(minutes / 60);
    return hours === 1 ? hours + " hour" : hours + " hours";
  }
};

export const processClip = async (playlist: string, id: string) => {
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

  const streams = await Promise.all(segments.map(async (seg) => {
    const rangeBytes = `bytes=${seg.start}-${seg.end}`;
    const response = await $fetch(`${baseUrl}/${seg.file}`, { responseType: "stream", headers: { Range: rangeBytes } }).catch(() => null);
    return response as ReadableStream;
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
  const unpkg = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
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
    const data = await $ffmpeg.readFile(`${id}.mp4`) as Uint8Array;
    console.info("File has been read");
    return new Blob([(data).buffer], { type: "video/mp4" });
  }
  catch (e) {
    console.info(e);
    return null;
  }
};
