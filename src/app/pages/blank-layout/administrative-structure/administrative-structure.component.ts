import { Component } from '@angular/core';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../../../core/services/shared/employees.service';
import { IEmployeeRow } from '../../../core/interfaces/IEmployess';
import { MetaTagsHandleService } from '../../../core/services/content/meta-tags-handle.service';

@Component({
  selector: 'app-administrative-structure',
  imports: [BlankNavbarComponent, CommonModule],
  templateUrl: './administrative-structure.component.html',
  styleUrls: ['./administrative-structure.component.scss']
})
export class AdministrativeStructureComponent {
  structure!: IEmployeeRow[];
  isTotalRecordsEqualsTotalDisabled: boolean = false;
  constructor(
    private _EmployeesService: EmployeesService,
    private _MetaTagsHandleService: MetaTagsHandleService
  ) { }

  ngOnInit(): void {
    this._MetaTagsHandleService.handleMeta();
    this._EmployeesService.getAllEmployees().subscribe({
      next: (response) => {
        console.log(response);
        this.structure = response.rows;
        let totalDisabledNum = response.rows.filter(
          (e) => e.status == 0
        ).length;
        if (totalDisabledNum === response.rows.length) {
          this.isTotalRecordsEqualsTotalDisabled = true;
        }
      },
    });
  }
}
