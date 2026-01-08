import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceBarChartComponent } from '../../../shared/components/charts/attendance-bar-chart/attendance-bar-chart.component';

interface StatCard {
  title: string;
  value: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: string;
  iconColor: string;
  bgColor: string;
  subtitle?: string;
  additionalInfo?: string;
  additionalInfoLabel?: string;
  progressPercentage?: number;
}

interface ActivityItem {
  id: number;
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  time: string;
}

interface ChartData {
  day: string;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AttendanceBarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  readonly statsCards: StatCard[] = [
    {
      title: 'Total Students',
      value: '850',
      change: 12,
      changeType: 'increase',
      icon: 'school',
      iconColor: 'text-brand-500 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Guardians',
      value: '1,200',
      change: 5,
      changeType: 'increase',
      icon: 'family_restroom',
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Attendance',
      value: '92%',
      subtitle: 'Present today',
      additionalInfo: '68',
      additionalInfoLabel: 'Absent',
      icon: 'how_to_reg',
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      progressPercentage: 92
    },
    {
      title: 'Active Classes',
      value: '32',
      subtitle: '/ 35 scheduled',
      icon: 'class',
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  // Mock data for different time ranges
  readonly mockChartData = {
    'This Week': [
      { day: 'Mon', percentage: 85 },
      { day: 'Tue', percentage: 92 },
      { day: 'Wed', percentage: 88 },
      { day: 'Thu', percentage: 95 },
      { day: 'Fri', percentage: 78 }
    ],
    'Last Week': [
      { day: 'Mon', percentage: 82 },
      { day: 'Tue', percentage: 89 },
      { day: 'Wed', percentage: 91 },
      { day: 'Thu', percentage: 87 },
      { day: 'Fri', percentage: 83 }
    ],
    'Last Month': [
      { day: 'Week 1', percentage: 88 },
      { day: 'Week 2', percentage: 91 },
      { day: 'Week 3', percentage: 86 },
      { day: 'Week 4', percentage: 90 }
    ]
  };

  readonly timeRanges = ['This Week', 'Last Week', 'Last Month'];
  selectedTimeRange = this.timeRanges[0];
  currentChartData: ChartData[] = this.mockChartData[this.selectedTimeRange as keyof typeof this.mockChartData];

  readonly recentActivities: ActivityItem[] = [
    {
      id: 1,
      icon: 'person_add',
      iconColor: 'text-brand-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      title: 'New student registered',
      description: 'Liam Johnson added to Grade 10',
      time: '2 mins ago'
    },
    {
      id: 2,
      icon: 'check_circle',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      title: 'Attendance Synced',
      description: 'Class 9B submitted successfully',
      time: '15 mins ago'
    },
    {
      id: 3,
      icon: 'warning',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      title: 'Low Attendance Alert',
      description: 'Class 12A below 75% today',
      time: '1 hour ago'
    },
    {
      id: 4,
      icon: 'mail',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      title: 'Guardian Message',
      description: 'Mrs. Smith regarding leave',
      time: '2 hours ago'
    }
  ];

  onTimeRangeChange(event: Event): void {
    this.selectedTimeRange = (event.target as HTMLSelectElement).value;
    this.currentChartData = this.mockChartData[this.selectedTimeRange as keyof typeof this.mockChartData];
  }

  takeAttendance(): void {
    console.log('Take attendance clicked');
  }

  addStudent(): void {
    console.log('Add student clicked');
  }

  viewReports(): void {
    console.log('View reports clicked');
  }
}
