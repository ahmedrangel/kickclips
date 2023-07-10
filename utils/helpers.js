export const formatTime = (durationSeconds) => {
  const minutes = (Math.floor(durationSeconds / 60)).toString().padStart(2, "0");
  const seconds = (durationSeconds % 60).toString().padStart(2, "0");
  const formattedTime = minutes + ":" + seconds;
  return formattedTime;
};

export const getDate = (datetime) => {
  const date = new Date(datetime);
  const isoDate = date.toISOString().split("T")[0];
  const time = date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formattedDate = `${isoDate}, ${time}`;
  return formattedDate;
};

export const getTimeByMs = (seconds) => {
  const time = new Date(Math.ceil(seconds / 12500) * 12500).toISOString().slice(11, -5);
  return time;
};

export const getUrlId = (url) => {
  const regex = /\/([a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9]+)?(?:\?|$|\/\?|\/$)/;
  const result = regex.exec(url);
  return (result && result.length > 1) ? result[1] : null;
};

export const minutesOrHours = (minutes) => {
  if (minutes < 60) {
    return minutes === 1 ? minutes + " minute" : minutes + " minutes";
  } else {
    var hours = Math.floor(minutes / 60);
    return hours === 1 ? hours + " hour" : hours + " hours";
  }
};