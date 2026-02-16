import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagesSrc',
  standalone: true,
})
export class ImagesSrcPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value; // handle null or undefined values
    return value.includes('watanye')
      ? value.replace(/watanye/g, 'asda-alkhaleej')
      : value;
  }
}
