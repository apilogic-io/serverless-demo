import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'thxEnumToObject' })
export class EnumToObjectPipe implements PipeTransform {
  transform(value: any): { label: string; value: any }[] {
    return Object.keys(value).map((enumKey: string) => {
      return { label: value[enumKey], value: enumKey };
    });
  }
}
