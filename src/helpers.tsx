// https://www.30secondsofcode.org/js/s/slugify
export const slugifyString = (str: any) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+/g, '')
    .replace(/-+$/g, '');
};

export const capitalizeFirstLetter = (string: any) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const convertDateToSeconds = (date: any, onChangeFunction: any) => {
  let dateInSeconds = date;
  if (date !== null) {
    let dateInMilliseconds = date;
    if (typeof date.getTime === 'function') {
      dateInMilliseconds = date.getTime();
    }
    dateInSeconds = Math.floor(dateInMilliseconds / 1000);
  }

  if (onChangeFunction) {
    onChangeFunction(dateInSeconds);
  } else {
    return dateInSeconds;
  }

  return undefined;
};
