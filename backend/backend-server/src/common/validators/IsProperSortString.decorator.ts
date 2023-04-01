import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidateSort' })
@Injectable()
export class ValidateSort implements ValidatorConstraintInterface {
  async validate(value: string) {
    const splits = value.split(',');

    for (let i = 0; i < splits.length; i++) {
      const subSplit = splits[i].split(':');

      if (subSplit[1] && !['asc', 'desc', 1, -1].includes(subSplit[1])) {
        return false;
      }
    }
    return true;
  }

  defaultMessage() {
    return 'Malformed sort query. Use: "property:{ asc | desc | 1 | -1 }"';
  }
}
