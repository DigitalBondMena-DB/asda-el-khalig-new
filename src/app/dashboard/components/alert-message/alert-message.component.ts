import { Component } from '@angular/core';
import { StaticsService } from '../../services/statics.service';
import moment from 'moment-hijri'; // Import the Hijri moment library
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss',
})
export class AlertMessageComponent {
  constructor(private _StaticsService: StaticsService) {}
  currentTime: string = '';
  showTimeDiv: boolean = false;
  position: any = 'bottomleft';
  message: string = ''; // To store the full message
  textToShow: string = ''; // The text that will be typed out
  private typingInterval: any; // To hold the typing interval reference

  // Method to check if it's been more than 1 hour since the last message was shown
  canShowMessage(): boolean {
    if (typeof window == 'undefined') return true;
    const lastMessageTime = localStorage.getItem('lastMessageTime') ?? '';
    if (lastMessageTime) {
      const diffInHours = moment().diff(moment(lastMessageTime), 'hours');
      return diffInHours >= 1; // Return true if 1 hour has passed
    }
    return true; // If no time is stored, assume it's fine to show the message
  }

  showTime() {
    if (this.canShowMessage()) {
      this._StaticsService.getStatics().subscribe({
        next: (res) => {
          if (res.latestBlogs.length > 0) {
            this.showTimeDiv = !this.showTimeDiv;
            this.currentTime = moment(res.latestBlogs[0].created_at)
              .format('iDD iMMMM iYYYY [الساعة] hh:mm A')
              .replace('AM', 'ص') // Replacing AM with ص
              .replace('PM', 'م'); // Replacing PM with م
            // Set the text that will be typed
            this.textToShow = `
              انتبه!
              آخر مرة قمت فيها بنشر مدونة كانت في ${this.currentTime}.`;
            this.startTypingEffect();

            // Store the current time in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('lastMessageTime', moment().toString());
            }
          }
        },
      });
    }
  }

  closeTimer(): void {
    this.showTimeDiv = false;
  }

  ngOnInit() {
    setTimeout(() => {
      this.showTime();
    }, 2000);

    // Automatically check and show the message every hour
    setInterval(() => {
      this.showTime(); // Call showTime every hour
    }, 3600000); // 3600000 ms = 1 hour
  }

  startTypingEffect() {
    let i = 0;
    const speed = 35; // The speed at which each letter is typed (milliseconds)

    // Clear any previous text and reset the typing process
    this.message = '';

    // Clear any previous typing interval if it's still active
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    // Start typing the message
    this.typingInterval = setInterval(() => {
      if (i < this.textToShow.length) {
        this.message += this.textToShow.charAt(i);
        i++;
      } else {
        clearInterval(this.typingInterval); // Stop the interval when all characters are typed
      }
    }, speed);
  }
}
