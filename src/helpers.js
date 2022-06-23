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
  const dateInSeconds = Math.floor(date.getTime() / 1000);
  if (onChangeFunction) {
    onChangeFunction(dateInSeconds);
  } else {
    return dateInSeconds;
  }
});
