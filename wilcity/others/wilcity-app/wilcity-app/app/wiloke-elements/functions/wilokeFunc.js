export const isEmpty = prop =>
  prop === null ||
  prop === undefined ||
  (prop.hasOwnProperty("length") && prop.length === 0) ||
  (prop.constructor === Object && Object.keys(prop).length === 0);

export const filterMax = arr => max => arr.filter((item, index) => index < max);

export const zeroPad = number =>
  number < 10 && number > 0 ? `0${number}` : number;
