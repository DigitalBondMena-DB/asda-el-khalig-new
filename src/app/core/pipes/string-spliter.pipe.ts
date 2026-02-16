import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringSpliter',
  standalone: true,
})
export class StringSpliterPipe implements PipeTransform {
  transform(value: string): string {
    return value.split(' ').slice(0, 2).join(' ');
  }
}
