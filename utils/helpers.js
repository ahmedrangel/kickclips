export const formatTime = (durationSeconds) => {
  const minutes = (Math.floor(durationSeconds / 60)).toString().padStart(2, "0");
  const seconds = (durationSeconds % 60).toString().padStart(2, "0");
  const formattedTime = minutes + ":" + seconds;
  return formattedTime;
};

export const getDate = (datetime) => {
  const date = new Date(datetime);
  let d = date.getDate();
  let m = date.getMonth() + 1;
  const y = date.getFullYear();
  let hr = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  const amPm = hr >= 12 ? "PM" : "AM";
  hr = hr > 12 ? hr - 12 : hr;
  d = d.toString().padStart(2, "0");
  m = m.toString().padStart(2, "0");
  hr = hr.toString().padStart(2, "0");
  min = min.toString().padStart(2, "0");
  sec = sec.toString().padStart(2, "0");
  const formattedDate = `${y}-${m}-${d}, ${hr}:${min}:${sec} ${amPm}`;
  return formattedDate;
};
