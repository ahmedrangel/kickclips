import { FFmpeg } from "@ffmpeg/ffmpeg";
import ffmpegUtils from "@ffmpeg/util";

const provider = new FFmpeg();

const ffmpegEventHandler = (event: "log" | "progress", callback: ({ type, message, progress, time }: { type?: string, message?: string, progress?: number, time?: number }) => void) => {
  switch (event) {
    case "log":
      provider.on("log", ({ type, message }) => callback({ type, message }));
      break;
    case "progress":
      provider.on("progress", ({ progress, time }) => callback({ progress, time }));
      break;
  }
};

const ffmpeg = {
  ...provider,
  on: ffmpegEventHandler,
  off: ffmpegEventHandler,
  ...ffmpegUtils
};

export default defineNuxtPlugin(() => {
  return {
    provide: { ffmpeg }
  };
});
