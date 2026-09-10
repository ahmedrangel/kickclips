export const formatTime = (durationSeconds: number) => {
  const minutes = (Math.floor(durationSeconds / 60)).toString().padStart(2, "0");
  const seconds = (durationSeconds % 60).toString().padStart(2, "0");
  const formattedTime = minutes + ":" + seconds;
  return formattedTime;
};

export const formatViews = (views: number) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  }
  else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  else {
    return views.toString();
  }
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

export const searchChannel = async (text: string) => {
  const data = await $fetch<{ results: KickChannelSearchResult[] }>("https://search.kick.com/multi_search", {
    method: "POST",
    headers: {
      "X-Typesense-Api-Key": "nXIMW0iEN6sMujFYjFuhdrSwVow3pDQu"
    },
    body: {
      searches: [
        { preset: "channel_search", q: text }
      ]
    }
  }).catch(() => null);
  return data?.results?.[0]?.hits.map(hit => ({
    ...hit?.document
  })) || [];
};
