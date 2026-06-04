import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../../../core/services/shared/employees.service';
import { IEmployeeRow } from '../../../core/interfaces/IEmployess';
import { MetaTagsHandleService } from '../../../core/services/content/meta-tags-handle.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-administrative-structure',
  imports: [BlankNavbarComponent, CommonModule],
  templateUrl: './administrative-structure.component.html',
  styleUrls: ['./administrative-structure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministrativeStructureComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _EmployeesService = inject(EmployeesService);
  private readonly _MetaTagsHandleService = inject(MetaTagsHandleService);

  structure = signal<IEmployeeRow[]>([]);
  isTotalRecordsEqualsTotalDisabled = signal<boolean>(false);


  ngOnInit(): void {
    this._MetaTagsHandleService.handleMeta();
    this._EmployeesService.getAllEmployees().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.structure.set(response.rows);
        let totalDisabledNum = response.rows.filter(
          (e) => e.status == 0
        ).length;
        if (totalDisabledNum === response.rows.length) {
          this.isTotalRecordsEqualsTotalDisabled.set(true);
        }
      },
    });
  }
}
