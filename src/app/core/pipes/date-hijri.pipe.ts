import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-hijri';

@Pipe({
  name: 'hijriDate',
  standalone: true, // Marking the pipe as standalone
})
export class HijriDatePipe implements PipeTransform {
  transform(
    value: unknown,
    format: string = 'iD iMMMM iYYYY | hh:mm A'
  ): unknown {
    if (!value || typeof value !== 'string') {
      return null;
    }

    try {
      // Ensure proper parsing of date
      let hijriDate = moment(value, 'YYYY-MM-DD HH:mm:ss', true) // `true` ensures strict parsing
        .locale('ar-sa') // Use Arabic locale
        .format(format);

      // Manually replace AM/PM with Arabic ص / م
      hijriDate = hijriDate.replace('AM', 'ص').replace('PM', 'م');

      return hijriDate;
    } catch (error) {
      console.error('Hijri Date Conversion Error:', error);
      return value;
    }
  }
}
