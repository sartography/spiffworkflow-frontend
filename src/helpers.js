// https://www.30secondsofcode.org/js/s/slugify
export const slugifyString = ((str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
});

export const convertDateToSeconds = ((date, onChangeFunction) => {
  let dateInMilliseconds = date;
  if (typeof(date.getTime) === "function") {
    dateInMilliseconds = date.getTime();
  }
  const dateInSeconds = Math.floor(dateInMilliseconds / 1000);
  if (onChangeFunction) {
    onChangeFunction(dateInSeconds);
  } else {
    return dateInSeconds;
  }
});
