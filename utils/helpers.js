export const formatTime = (durationSeconds) => {
  const minutes = (Math.floor(durationSeconds / 60)).toString().padStart(2, "0");
  const seconds = (durationSeconds % 60).toString().padStart(2, "0");
  const formattedTime = minutes + ":" + seconds;
  return formattedTime;
};
