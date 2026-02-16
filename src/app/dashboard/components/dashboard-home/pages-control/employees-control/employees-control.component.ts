import { Component } from '@angular/core';
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
import { EmployeesService } from '../../../../services/employees.service';
import { IEmployeeRow } from '../../../../../core/interfaces/IEmployess';

@Component({
  selector: 'app-employees-control',
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
  templateUrl: './employees-control.component.html',
  styleUrl: './employees-control.component.scss',
  providers: [MessageService],
})
export class EmployeesControlComponent {
  employees!: IEmployeeRow[];
  cols: any[] = [];
  selectedEmployee: IEmployeeRow = {} as IEmployeeRow;
  employeeDialog: boolean = false;
  submitted: boolean = false;
  selectedImage: File | null = null;

  constructor(
    private employeesService: EmployeesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'معرف' },
      { field: 'name', header: 'اسم الموظف' },
      { field: 'title', header: 'الوظيفة' },
      { field: 'status', header: 'الحالة' },
      { field: 'created_at', header: 'تاريخ الإنشاء' },
      { field: 'updated_at', header: 'تاريخ التحديث' },
    ];
    this.loadEmployees();
  }

  // Load employees from API
  loadEmployees() {
    this.employeesService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response.rows;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'حدث خطأ أثناء تحميل قائمة الموظفين',
        }),
    });
  }

  // Open add employee dialog
  openAddEmployeeDialog() {
    this.selectedEmployee = {} as IEmployeeRow;
    this.submitted = false;
    this.selectedImage = null; // Reset image
    this.employeeDialog = true;
  }

  // Save employee (Add or Update)
  saveEmployee() {
    this.submitted = true;

    // Ensure that name and title are provided
    if (!this.selectedEmployee.name || !this.selectedEmployee.title) return;

    let employeeDetails = {
      name: this.selectedEmployee.name,
      title: this.selectedEmployee.title,
    };

    if (this.selectedEmployee.id) {
      // Prepare the form data for update (without image if not selected)
      const formData = new FormData();
      formData.append('name', this.selectedEmployee.name);
      formData.append('title', this.selectedEmployee.title);

      if (this.selectedImage) {
        formData.append(
          'main_image',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      // Send update request with or without image
      this.employeesService
        .updatEmployee(this.selectedEmployee.id, formData)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجاح',
              detail: 'تم تحديث الموظف بنجاح',
            });
            this.loadEmployees();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'حدث خطأ أثناء تحديث الموظف',
            }),
        });
    } else {
      // Prepare form data for adding employee (with image if selected)
      const formData = new FormData();
      formData.append('name', this.selectedEmployee.name);
      formData.append('title', this.selectedEmployee.title);
      formData.append('status', '1');

      if (this.selectedImage) {
        formData.append(
          'main_image',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      this.employeesService.addEmployee(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم إضافة الموظف بنجاح',
          });
          this.loadEmployees();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'حدث خطأ أثناء إضافة الموظف',
          }),
      });
    }

    this.employeeDialog = false;
    this.selectedEmployee = {} as IEmployeeRow;
    this.selectedImage = null; // Reset image selection
  }

  // Toggle employee status
  toggleStatus(employee: IEmployeeRow) {
    if (employee.status === 0) {
      this.employeesService.disableEmployee(employee.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث حالة الموظف بنجاح',
          });
        },
      });
    } else {
      this.employeesService.enableEmployee(employee.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث حالة الموظف بنجاح',
          });
        },
      });
    }
  }

  openEditEmployeeDialog(employee: IEmployeeRow) {
    this.selectedEmployee = { ...employee };
    this.employeeDialog = true;
  }

  // Hide dialog
  hideDialog() {
    this.employeeDialog = false;
    this.submitted = false;
  }
  // Handle image file selection
  onFileSelect(event: any) {
    this.selectedImage = event.target.files[0];
  }
}
