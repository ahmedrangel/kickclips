import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const provider = new FFmpeg();

const ffmpeg = {
  ...provider,
  on: provider.on.bind(provider),
  off: provider.off.bind(provider),
  toBlobURL
};

export default defineNuxtPlugin(() => {
  return {
    provide: { ffmpeg }
  };
});
