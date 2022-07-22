import { format } from 'date-fns';
import { DATE_FORMAT } from './config';

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

  return null;
};

export const convertSecondsToFormattedDate = (seconds: number) => {
  if (seconds) {
    const startDate = new Date(seconds * 1000);
    return format(startDate, DATE_FORMAT);
  }
  return null;
};

export const objectIsEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
};
