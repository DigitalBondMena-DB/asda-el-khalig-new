import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MostViewedBlog } from '../../../../../../core/interfaces/IStatics';

@Component({
  selector: 'app-table-a-most-views-blog-chart',
  standalone: true,
  imports: [ChartModule, CardModule],
  templateUrl: './table-a-most-views-blog-chart.component.html',
  styleUrls: ['./table-a-most-views-blog-chart.component.scss'],
})
export class TableAMostViewsBlogChartComponent {
  // Blog data
  @Input() mostViewedBlogs!: MostViewedBlog[];
  totalViews: any;
  chartData: any;
  chartOptions: any;
  // Calculate total views
  ngAfterContentInit(): void {
    this.totalViews = this.mostViewedBlogs.reduce(
      (sum, article) => sum + article.blog_counder,
      0
    );

    // Chart data
    this.chartData = {
      labels: this.mostViewedBlogs.map((article) =>
        article.post_title.split(' ').splice(0, 3).join(' ')
      ),
      datasets: [
        {
          data: this.mostViewedBlogs.map((article) =>
            ((article.blog_counder / this.totalViews) * 100).toFixed(2)
          ),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#FF9F40',
          ],
        },
      ],
    };

    // Chart options with DataLabels plugin for displaying percentages inside slices
    this.chartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const articleIndex = context.dataIndex;
              const articleTitle =
                this.mostViewedBlogs[articleIndex].post_title;
              const percentage = context.raw;
              return `${articleTitle}: ${percentage}%`;
            },
          },
        },
        legend: {
          position: 'top',
        },
        datalabels: {
          color: '#ffffff', // White color for the percentage text
          font: {
            size: 16, // Font size of the label
            weight: 'bold', // Bold text
          },
          formatter: (value: any) => `${value}%`, // Show percentage values
          anchor: 'bottom', // Place text at the center of each slice
          align: 'right', // Align text at the center of each slice
          offset: 0, // No offset, ensure the text is exactly centered
        },
      },
    };
  }
}
