import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HijriDatePipe } from '../../../../../../core/pipes/date-hijri.pipe';
import moment from 'moment-hijri'; // Import the Hijri moment library

@Component({
  selector: 'app-d-total-monthly-views',
  standalone: true,
  imports: [CommonModule, HijriDatePipe],
  templateUrl: './d-total-monthly-views.component.html',
  styleUrl: './d-total-monthly-views.component.scss',
})
export class DTotalMonthlyViewsComponent {
  lastWeekStart!: string;
  lastWeekEnd!: string;
  @Input() lastWeekCounters: number = 0;
  @Input() lastTwoWeeksCounters: number = 0;
  percentageChange: number = 0;

  changeType: string = '';
  ngOnInit() {
    const today = new Date();

    // Clone today to avoid mutation
    let lastWeekEnd = new Date(today);
    lastWeekEnd.setDate(today.getDate() - 1);

    let lastWeekStart = new Date(lastWeekEnd); // Clone lastWeekEnd
    lastWeekStart.setDate(lastWeekEnd.getDate() - 6);

    console.log(lastWeekEnd); // Correct lastWeekEnd
    console.log(lastWeekStart); // Correct lastWeekStart

    // Format the Hijri dates
    this.lastWeekEnd = moment(lastWeekEnd)
      .locale('ar-sa')
      .format('iD iMMMM iYYYY');
    this.lastWeekStart = moment(lastWeekStart)
      .locale('ar-sa')
      .format('iD iMMMM iYYYY');

    console.log(this.lastWeekEnd); // Formatted Hijri date
    console.log(this.lastWeekStart); // Formatted Hijri date

    this.calculatePercentageChange();
  }

  calculatePercentageChange(): void {
    if (this.lastTwoWeeksCounters === 0) {
      this.percentageChange = 0; // To prevent division by zero
      this.changeType = ''; // or any default text you want to show in this case
    } else {
      const difference = this.lastWeekCounters - this.lastTwoWeeksCounters;
      this.percentageChange =
        Math.floor((difference / this.lastTwoWeeksCounters) * 100 * 100) / 100;

      // Conditional message for positive or negative change
      if (this.percentageChange > 0) {
        this.changeType = 'الزيادة'; // Positive change
      } else if (this.percentageChange < 0) {
        this.changeType = 'النقص'; // Negative change
      } else {
        this.changeType = 'لا تغيير'; // No change, if the percentage is zero
      }
    }
  }
}
