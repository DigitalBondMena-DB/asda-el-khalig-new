import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { HijriDatePipe } from '../../../../../core/pipes/date-hijri.pipe';
import { SlicePipe } from '@angular/common';
import { IGetAllContactUsMessagesContact } from '../../../../../core/interfaces/IContactUs';
import { ContactUsService } from '../../../../../core/services/content/contact-us.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    CardModule,
    ReactiveFormsModule,
    FormsModule,
    HijriDatePipe,
    TooltipModule,
    SlicePipe,
  ],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  emails!: IGetAllContactUsMessagesContact[];

  constructor(private _ContactUsService: ContactUsService) {}

  ngOnInit(): void {
    this._ContactUsService.getContactUs().subscribe({
      next: (response) => {
        this.emails = response.contacts;
      },
    });
  }

  selectedEmail!: IGetAllContactUsMessagesContact;
  emailDialogVisible: boolean = false;

  showDetails(email: IGetAllContactUsMessagesContact) {
    this.selectedEmail = email;
    this.emailDialogVisible = true;
  }

  // Filter table by name
  onGlobalFilter(table: any, event: any): void {
    table.filterGlobal(event.target.value, 'contains');
  }
}
