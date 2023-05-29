/* Importing the Logger class from the @nestjs/common package. */
import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { isDate } from 'class-validator';

export function ToDate(): (target: any, key: string) => void {
  return Transform(({ obj, key, value }: TransformFnParams) => {
    if (!value) {
      return undefined;
    }
    if (isDate(value)) {
      return value;
    }

    const date = new Date(value);

    if (!isDate(date)) {
      throw new BadRequestException(
        `Invalid UTC date format for ${key}: ${value}`,
      );
    }

    obj[key] = date;
    return date;
  });
}
