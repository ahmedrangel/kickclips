import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const provider = new FFmpeg();

const ffmpeg = {
  ...provider,
  on: provider.on,
  off: provider.off,
  toBlobURL
};

export default defineNuxtPlugin(() => {
  return {
    provide: { ffmpeg }
  };
});
