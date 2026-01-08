import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexFill,
  ApexTooltip
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

export interface AttendanceData {
  day: string;
  percentage: number;
}

@Component({
  selector: 'app-attendance-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './attendance-bar-chart.component.html',
  styleUrls: ['./attendance-bar-chart.component.scss']
})
export class AttendanceBarChartComponent implements OnChanges {
  @Input() data: AttendanceData[] = [];
  @Input() timeRange: string = 'This Week';

  public series: ApexAxisChartSeries = [];

  public chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    height: 250,
    toolbar: {
      show: false,
    },
  };

  public colors: string[] = ['#465fff'];

  public plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
    },
  };

  public dataLabels: ApexDataLabels = {
    enabled: false,
  };

  public stroke: ApexStroke = {
    show: true,
    width: 2,
    colors: ['transparent'],
  };

  public xaxis: ApexXAxis = {
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: ['#667085'],
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
      },
    },
  };

  public yaxis: ApexYAxis = {
    title: {
      text: 'Attendance %',
      style: {
        color: '#667085',
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
      },
    },
    min: 0,
    max: 100,
    labels: {
      formatter: (val: number) => `${val}%`,
      style: {
        colors: ['#667085'],
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
      },
    },
  };

  public legend: ApexLegend = {
    show: false,
  };

  public grid: ApexGrid = {
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  };

  public fill: ApexFill = {
    opacity: 1,
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#465fff'],
      inverseColors: false,
      opacityFrom: 0.8,
      opacityTo: 0.3,
    },
  };

  public tooltip: ApexTooltip = {
    x: {
      show: true,
    },
    y: {
      formatter: (val: number) => `${val}%`,
      title: {
        formatter: (seriesName: string) => 'Attendance',
      },
    },
    theme: 'light',
    style: {
      fontSize: '12px',
      fontFamily: 'Outfit, sans-serif',
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    this.series = [{
      name: 'Attendance',
      data: this.data.map(item => item.percentage)
    }];

    this.xaxis.categories = this.data.map(item => item.day);
  }
}
