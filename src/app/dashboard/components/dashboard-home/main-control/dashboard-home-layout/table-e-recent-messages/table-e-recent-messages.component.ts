import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { HijriDatePipe } from '../../../../../../core/pipes/date-hijri.pipe';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LatestContact } from '../../../../../../core/interfaces/IStatics';
import { DialogModule } from 'primeng/dialog';
import { IGetAllContactUsMessagesContact } from '../../../../../../core/interfaces/IContactUs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-e-recent-messages',
  standalone: true,
  imports: [
    TableModule,
    HijriDatePipe,
    CardModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    FormsModule,
    CardModule,
  ],
  templateUrl: './table-e-recent-messages.component.html',
  styleUrl: './table-e-recent-messages.component.scss',
})
export class TableERecentMessagesComponent {
  @Input() latestContact!: LatestContact[];
  selectedEmail!: IGetAllContactUsMessagesContact;
  emailDialogVisible: boolean = false;
  constructor(private router: Router) {}

  showDetails(email: IGetAllContactUsMessagesContact) {
    this.selectedEmail = email;
    this.emailDialogVisible = true;
  }
}
