import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

export interface AttendanceSummary {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon?: string;
  progress?: number;
  subtitleColor?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  isExpanded: boolean;
  synced: boolean;
  students: StudentAttendance[];
}

export interface StudentAttendance {
  rollNo: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'late';
  timeIn: string;
  guardianNotified: string;
  synced: boolean;
}

@Component({
  selector: 'app-class-attendance',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './class-attendance.component.html',
  styleUrls: ['./class-attendance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassAttendanceComponent {
  // Filter state
  selectedClass = 'All Classes';
  selectedDate = '';
  selectedStudent = '';
  selectedGuardian = '';

  // Filter options
  readonly classes = ['All Classes', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A'];
  readonly dates = ['All Dates', 'Today', 'This Week', 'This Month'];

  // Summary cards data
  readonly summaryCards: AttendanceSummary[] = [
    {
      title: 'Avg. Attendance',
      value: '94.8%',
      subtitle: 'this month',
      change: '+2.5%',
      changeType: 'positive',
      progress: 94.8
    },
    {
      title: 'Total Absences',
      value: '42',
      subtitle: 'students',
      icon: 'person_off',
      subtitleColor: 'text-gray-500'
    },
    {
      title: 'Late Arrivals',
      value: '18',
      subtitle: 'students',
      icon: 'schedule',
      subtitleColor: 'text-orange-500'
    },
    {
      title: 'Sync Status',
      value: '100%',
      subtitle: 'All records synced',
      icon: 'cloud_sync',
      subtitleColor: 'text-green-500'
    }
  ];

  // Mock attendance records
  attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      date: 'Oct 24, 2023',
      className: 'Grade 10-B',
      totalStudents: 32,
      present: 28,
      absent: 3,
      late: 1,
      isExpanded: true,
      synced: true,
      students: [
        {
          rollNo: '10201',
          name: 'Alice Johnson',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG8ww-MLl4G6XNAw3dzPKaa6sWnFyxSQwGa78VL-3g1yodhLOb4AueTp8H5WFXrxhEPy7Gs_j9WdCWo6SmlpikMkMSh5qfiG5nqqjZf5zYmxs-hoJAkjfPKvyhmZsBBp6IepJNVr-HCI1sXiyIFzT_2BaZAk0nZr9y8UjsmH8ETjAT6Gnq8yWtK1XlCtO6phVK2fF903NufssiWLWwBlrPSuvMnDvLNqm5elPmrkkHJTFg3NqLEoY_IvtkoXDE5-6DBM7b9vUfOx2n',
          status: 'present',
          timeIn: '07:45 AM',
          guardianNotified: '-',
          synced: true
        },
        {
          rollNo: '10202',
          name: 'Bob Smith',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChcHq_tMME9hlektTcmTZD2wjYzTNq5UynvjIwd61HjjAh4CtFavrCS51SGXpIgixv9R3hGqWqxmyc9q8W6hLgct6z9p5X44CWLZj35OCDT2cBAvuYCistJ5bXcjvCvLG1hXekn1vp8FI0J-QNKLgYgUgT8uDSKu-OoydOpcYL3TSm3ItJA3TjWpI1E_Lat8K1LiYUYlYI2TolnKzC9tYxrHufapDRA310b1RxQMuTSeVmAE3UgmlldYRWroQiJ18AdNCvpTIEnIzj',
          status: 'late',
          timeIn: '08:15 AM',
          guardianNotified: '-',
          synced: true
        },
        {
          rollNo: '10203',
          name: 'Charlie Davis',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByUK14dBPFspEBUSvHU445vPBB4YyzEzw0Tlk1NyxTCgVZPWLt6mBNWVnzxQoMWQsSSGA7CGbh7h4ktEuo3GFyutIg-1PGCHAOwr-EMDrPDdTYhbWaRG9FW3jSUxx_Px4gsE3WR8REVwSYpcvxf6xQU1OYWyn31QsYaBuw_7camcuQJtHVS7FvQptADmAqcJHbrUhMCUNXo8txZJ8N6jeBGogce3un5-18uJQGRh6x3P7W0DDXAgKbP6fkie7eogRF6nfh3JercFDV',
          status: 'absent',
          timeIn: '-',
          guardianNotified: 'Yes',
          synced: true
        }
      ]
    },
    {
      id: '2',
      date: 'Oct 23, 2023',
      className: 'Grade 10-A',
      totalStudents: 30,
      present: 29,
      absent: 1,
      late: 0,
      isExpanded: false,
      synced: true,
      students: []
    },
    {
      id: '3',
      date: 'Oct 22, 2023',
      className: 'Grade 11-A',
      totalStudents: 28,
      present: 25,
      absent: 2,
      late: 1,
      isExpanded: false,
      synced: false,
      students: []
    }
  ];

  // Event handlers
  onClassChange(event: Event): void {
    this.selectedClass = (event.target as HTMLSelectElement).value;
    this.filterRecords();
  }

  onDateChange(event: Event): void {
    this.selectedDate = (event.target as HTMLSelectElement).value;
    this.filterRecords();
  }

  onStudentSearch(event: Event): void {
    this.selectedStudent = (event.target as HTMLInputElement).value;
    this.filterRecords();
  }

  onGuardianSearch(event: Event): void {
    this.selectedGuardian = (event.target as HTMLInputElement).value;
    this.filterRecords();
  }

  onReset(): void {
    this.selectedClass = 'All Classes';
    this.selectedDate = '';
    this.selectedStudent = '';
    this.selectedGuardian = '';
  }

  onApplyFilters(): void {
    this.filterRecords();
  }

  toggleRecordExpansion(recordId: string): void {
    const record = this.attendanceRecords.find(r => r.id === recordId);
    if (record) {
      record.isExpanded = !record.isExpanded;
    }
  }

  downloadCSV(record: AttendanceRecord): void {
    console.log('Downloading CSV for:', record.date, record.className);
  }

  private filterRecords(): void {
    // This would implement actual filtering logic
    console.log('Filtering records with:', {
      class: this.selectedClass,
      date: this.selectedDate,
      student: this.selectedStudent,
      guardian: this.selectedGuardian
    });
  }

  // Get status badge styling
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900';
      case 'absent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900';
      case 'late':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-900';
    }
  }

  // Get status text color
  getStatusTextColor(status: string): string {
    switch (status) {
      case 'present':
        return 'text-green-600';
      case 'absent':
        return 'text-red-500';
      case 'late':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  }
}
