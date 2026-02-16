import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  NgbCalendar,
  NgbCalendarIslamicCivil,
  NgbDateStruct,
  NgbDatepickerI18n,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
const MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {
  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }

  getWeekdayLabel(weekday: number) {
    return WEEKDAYS[weekday - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: 'ngbd-datepicker-islamiccivil',
  standalone: true,
  templateUrl: './datepicker-islamiccivil.component.html',
  styleUrls: ['./datepicker-islamiccivil.component.scss'],
  imports: [NgbDatepickerModule, FormsModule],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NgbdDatepickerIslamiccivil,
      multi: true,
    },
  ],
})
export class NgbdDatepickerIslamiccivil implements ControlValueAccessor {
  today = inject(NgbCalendar).getToday();
  model!: NgbDateStruct;

  @Input() value!: NgbDateStruct;
  @Output() valueChange = new EventEmitter<NgbDateStruct>();

  onTouched = () => {};
  onChange = (value: NgbDateStruct) => {};

  writeValue(value: NgbDateStruct): void {
    this.model = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  selectDate(date: any) {
    this.model = date;
    this.onChange(this.model);
    this.valueChange.emit(this.model);
  }
}
