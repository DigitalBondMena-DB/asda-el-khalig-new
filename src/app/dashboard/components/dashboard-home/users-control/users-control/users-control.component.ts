import { Component, OnInit } from '@angular/core';
import { IWriter, Writer } from '../../../../../core/interfaces/IWriters';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HijriDatePipe } from '../../../../../core/pipes/date-hijri.pipe';
import { WritersService } from '../../../../services/writers.service';

@Component({
  selector: 'app-users-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    InputSwitchModule,
    HijriDatePipe,
  ],
  templateUrl: './users-control.component.html',
  styleUrls: ['./users-control.component.scss'],
  providers: [MessageService],
})
export class UsersControlComponent implements OnInit {
  writers!: IWriter[];
  cols: any[] = [];
  selectedWriter: Writer = {} as Writer;
  writerDialog: boolean = false;
  deleteWriterDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private writersService: WritersService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'معرف' },
      { field: 'writer_name', header: 'اسم الكاتب' },
      { field: 'writer_status', header: 'الحالة' },
      { field: 'created_at', header: 'تاريخ الإنشاء' },
      { field: 'updated_at', header: 'تاريخ التحديث' },
    ];
    this.loadWriters();
  }

  // Load writers from API
  loadWriters() {
    this.writersService.getAllWriters().subscribe({
      next: (response) => {
        this.writers = response.rows;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'حدث خطأ أثناء تحميل قائمة الكتاب',
        }),
    });
  }

  // Open add writer dialog
  openAddWriterDialog() {
    this.selectedWriter = {} as Writer;
    this.submitted = false;
    this.writerDialog = true;
  }

  // Save writer (Add or Update)
  saveWriter() {
    this.submitted = true;

    if (!this.selectedWriter.writer_name) return;

    if (this.selectedWriter.id) {
      let writer = {
        writer_name: this.selectedWriter.writer_name,
        writer_status: this.selectedWriter.writer_status,
      };
      // Update existing writer
      this.writersService
        .updateWriter(this.selectedWriter.id, writer)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجاح',
              detail: 'تم تحديث الكاتب بنجاح',
            });
            this.loadWriters();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'حدث خطأ أثناء تحديث الكاتب',
            }),
        });
    } else {
      let writer = {
        writer_name: this.selectedWriter.writer_name,
        writer_status: '1',
      };
      // Add new writer
      this.writersService.addWriter(writer).subscribe({
        next: (response) => {
          if (response.message) {
          }
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم إضافة الكاتب بنجاح',
          });
          this.loadWriters();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'حدث خطأ أثناء إضافة الكاتب',
          }),
      });
    }

    this.writerDialog = false;
    this.selectedWriter = {} as Writer;
  }

  // Delete writer
  deleteWriter(writer: Writer) {
    this.selectedWriter = writer;
    this.deleteWriterDialog = true;
  }

  confirmDeleteWriter() {
    this.writersService.disableWriter(this.selectedWriter.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجاح',
          detail: 'تم حذف الكاتب بنجاح',
        });
        this.loadWriters();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'حدث خطأ أثناء حذف الكاتب',
        }),
    });

    this.deleteWriterDialog = false;
  }

  // Toggle writer status
  toggleStatus(writer: Writer) {
    if (parseInt(writer.writer_status) === 0) {
      {
        this.writersService.disableWriter(writer.id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجاح',
              detail: 'تم تحديث حالة الكاتب بنجاح',
            });
          },
        });
      }
    } else {
      this.writersService.enableWriter(writer.id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث حالة الكاتب بنجاح',
          });
        },
      });
    }
  }

  openEditWriterDialog(writer: Writer) {
    this.selectedWriter = { ...writer };
    this.writerDialog = true;
  }

  // Hide dialog
  hideDialog() {
    this.writerDialog = false;
    this.submitted = false;
  }
}
