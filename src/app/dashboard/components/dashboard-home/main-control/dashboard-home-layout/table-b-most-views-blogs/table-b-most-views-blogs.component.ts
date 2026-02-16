import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MostViewedBlog } from '../../../../../../core/interfaces/IStatics';
import { HijriDatePipe } from '../../../../../../core/pipes/date-hijri.pipe';
@Component({
  selector: 'app-table-b-most-views-blogs',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    HijriDatePipe,
    ButtonModule,
    TooltipModule,

    RouterLink,
  ],
  templateUrl: './table-b-most-views-blogs.component.html',
  styleUrl: './table-b-most-views-blogs.component.scss',
})
export class TableBMostViewsBlogsComponent {
  @Input() mostViewedBlogs!: MostViewedBlog[];

  mostViewedArticles = [
    {
      title:
        'الشؤون الإسلامية في جازان وبالتعاون مع جمعية الدعوة والإرشاد وتوعية الجاليات تختتم الدورة العلمية المتقدمة الثانية في صامطة',
      views: 500,
      publishedDate: new Date('2025-01-01'),
    },
    {
      title: 'تنفيذ حكم القتل تعزيرًا بأحد الجناة في المنطقة الشرقية',
      views: 450,
      publishedDate: new Date('2025-01-03'),
    },
    {
      title:
        'نائب أمير منطقة حائل يتفقّد أعمال مشروع استكمال طريق "حائل - رفحاء" الجديد',
      views: 300,
      publishedDate: new Date('2025-01-05'),
    },
    {
      title:
        'الشؤون الإسلامية في جازان وبالتعاون مع جمعية الدعوة والإرشاد وتوعية الجاليات تختتم الدورة العلمية المتقدمة الثانية في صامطة',
      views: 200,
      publishedDate: new Date('2025-01-01'),
    },
    {
      title: 'تنفيذ حكم القتل تعزيرًا بأحد الجناة في المنطقة الشرقية',
      views: 150,
      publishedDate: new Date('2025-01-03'),
    },
  ];
}
