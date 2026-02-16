import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { MostViewedCategoriesBlog } from '../../../../../../core/interfaces/IStatics';

// Register the Data Labels Plugin
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-table-c-most-views-categories',
  standalone: true,
  imports: [TableModule, CardModule, ChartModule],
  templateUrl: './table-c-most-views-categories.component.html',
  styleUrl: './table-c-most-views-categories.component.scss',
})
export class TableCMostViewsCategoriesComponent {
  @Input() mostViewedCategoriesBlog!: MostViewedCategoriesBlog[];

  // Chart data
  categoryChartData: any;
  categoryChartOptions: any;

  ngAfterContentInit(): void {
    this.prepareChartData();
  }
  private prepareChartData() {
    // Extract labels and data for the chart
    const labels = this.mostViewedCategoriesBlog.map(
      (category) => category.category_name
    );
    const data = this.mostViewedCategoriesBlog.map(
      (category) => category.total_views
    );

    // Prepare the chart data structure
    this.categoryChartData = {
      labels: labels,
      datasets: [
        {
          label: 'عدد المشاهدات',
          data: data,
          backgroundColor: '#42A5F5', // Customize the bar color
          borderColor: '#1E88E5', // Customize the border color
          borderWidth: 1,
        },
      ],
    };

    // Chart options (customize as needed)
    this.categoryChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `مشاهدة: ${context.raw}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 50,
          },
        },
      },
    };
  }
}
