import { isDate, isObject } from 'class-validator';

export function removeUndefined(obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    if (isObject(obj[key]) && !isDate(obj[key])) {
      obj[key] = removeUndefined(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
    if (obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  });
  return obj;
}
