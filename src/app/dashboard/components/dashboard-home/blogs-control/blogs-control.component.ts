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
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { EmployeesService } from '../../../services/employees.service';
import { IEmployeeRow } from '../../../../core/interfaces/IEmployess';
import { BlogsService } from '../../../services/blogs.service';
import { categories } from '../../../../core/interfaces/IAllCategories';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-blogs-control',
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
    NgxSpinnerModule,
  ],
  templateUrl: './blogs-control.component.html',
  styleUrl: './blogs-control.component.scss',
  providers: [MessageService],
})
export class BlogsControlComponent {
  employees!: IEmployeeRow[];
  cols: any[] = [];
  selectedEmployee: categories = {} as categories;
  employeeDialog: boolean = false;
  submitted: boolean = false;
  selectedImage: File = new File([], '');

  constructor(
    private employeesService: EmployeesService,
    private messageService: MessageService,
    private blogsService: BlogsService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}

  allBlogsCategories!: categories[];

  categories = [
    { id: '01', name: 'أخبار محلية' },
    { id: '02', name: 'أخبار العالم' },
    { id: '03', name: 'الرياضة' },
    { id: 'f', name: 'ثقافة وفن' },
    { id: '04', name: 'الاقتصاد' },
    { id: '05', name: 'التعليم' },
    { id: '08', name: 'المقالات' },
    { id: 'i', name: 'تحقيقات' },
    { id: '09', name: 'أخبار المجتمع' },
    { id: '07', name: 'دراسات وأبحاث' },
    { id: '11', name: 'كاريكاتير' },
    { id: 'g', name: 'الصحة والحياة' },
    { id: '06', name: 'علوم وتكنولوجيا' },
    { id: 'h', name: 'وقائع أمنية' },
    { id: 'y', name: 'منوعات' },
    { id: '10', name: 'زاوية رئيس التحرير' },
  ];

  ngOnInit() {
    this.getAllBlogs();
  }

  getAllBlogs(): void {
    this.blogsService.getBlogs().subscribe({
      next: (response) => {
        console.log(response);
        let newArr = response.data.filter((e) =>
          this.categories.find((x) => x.id === e.slug)
        );
        console.log(newArr);
        this.allBlogsCategories = newArr;
        this._NgxSpinnerService.hide('blogs');
      },
    });
  }
  addBlogImage(): void {
    let formData = new FormData();
    formData.append(
      'category_image',
      this.selectedImage,
      this.selectedImage?.name
    );
    formData.append('categiry_slug', this.selectedEmployee.slug);
    this._NgxSpinnerService.show('blogs');
    console.log(this.selectedImage);
    console.log(this.selectedImage?.name);
    this._NgxSpinnerService.show();
    this.blogsService.uploadBlogImage(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.employeeDialog = false;
        this.getAllBlogs();
      },
    });
  }

  // Open add employee dialog
  openAddEmployeeDialog() {
    this.selectedEmployee = {} as categories;
    this.submitted = false;
    this.selectedImage = new File([], ''); // Reset image
    this.employeeDialog = true;
  }

  // Save employee (Add or Update)
  // saveEmployee() {
  //   this.submitted = true;

  //   // Ensure that name and title are provided
  //   if (!this.selectedEmployee.name || !this.selectedEmployee.title) return;

  //   let employeeDetails = {
  //     name: this.selectedEmployee.name,
  //     title: this.selectedEmployee.title,
  //   };

  //   if (this.selectedEmployee.id) {
  //     // Prepare the form data for update (without image if not selected)
  //     const formData = new FormData();
  //     formData.append('name', this.selectedEmployee.name);
  //     formData.append('title', this.selectedEmployee.title);

  //     if (this.selectedImage) {
  //       formData.append(
  //         'main_image',
  //         this.selectedImage,
  //         this.selectedImage.name
  //       );
  //     }

  //     // Send update request with or without image
  //     this.employeesService
  //       .updatEmployee(this.selectedEmployee.id, formData)
  //       .subscribe({
  //         next: (response) => {
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'نجاح',
  //             detail: 'تم تحديث الموظف بنجاح',
  //           });
  //         },
  //         error: () =>
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'خطأ',
  //             detail: 'حدث خطأ أثناء تحديث الموظف',
  //           }),
  //       });
  //   } else {
  //     // Prepare form data for adding employee (with image if selected)
  //     const formData = new FormData();
  //     formData.append('name', this.selectedEmployee.name);
  //     formData.append('title', this.selectedEmployee.title);
  //     formData.append('status', '1');

  //     if (this.selectedImage) {
  //       formData.append(
  //         'main_image',
  //         this.selectedImage,
  //         this.selectedImage.name
  //       );
  //     }

  //     this.employeesService.addEmployee(formData).subscribe({
  //       next: (response) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'نجاح',
  //           detail: 'تم إضافة الموظف بنجاح',
  //         });
  //       },
  //       error: () =>
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'خطأ',
  //           detail: 'حدث خطأ أثناء إضافة الموظف',
  //         }),
  //     });
  //   }

  //   this.employeeDialog = false;
  //   this.selectedEmployee = {} as IEmployeeRow;
  //   this.selectedImage = null; // Reset image selection
  // }

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

  openEditEmployeeDialog(employee: categories) {
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
