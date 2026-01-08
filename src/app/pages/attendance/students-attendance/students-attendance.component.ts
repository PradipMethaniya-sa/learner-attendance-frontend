import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

export interface StudentAttendance {
  id: string;
  studentId: string;
  name: string;
  initials: string;
  avatarColor: string;
  isPresent: boolean;
  timeIn: string;
  remarks: string;
  synced: boolean;
}

@Component({
  selector: 'app-students-attendance',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './students-attendance.component.html',
  styleUrls: ['./students-attendance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsAttendanceComponent {
  selectedClass = 'Grade 10 - A (Science)';
  selectedDate = '24 Oct, 2023';
  totalStudents = 24;
  searchTerm = '';

  students: StudentAttendance[] = [
    {
      id: '1',
      studentId: 'ST-2023-001',
      name: 'Aiden Thompson',
      initials: 'AT',
      avatarColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      isPresent: true,
      timeIn: '08:00',
      remarks: '',
      synced: true
    },
    {
      id: '2',
      studentId: 'ST-2023-002',
      name: 'Emma Davis',
      initials: 'ED',
      avatarColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      isPresent: false,
      timeIn: '',
      remarks: 'Medical appointment',
      synced: true
    },
    {
      id: '3',
      studentId: 'ST-2023-003',
      name: 'Oliver Wilson',
      initials: 'OW',
      avatarColor: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      isPresent: true,
      timeIn: '07:55',
      remarks: '',
      synced: true
    },
    {
      id: '4',
      studentId: 'ST-2023-004',
      name: 'Sophia Martinez',
      initials: 'SM',
      avatarColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      isPresent: true,
      timeIn: '08:10',
      remarks: 'Late due to traffic',
      synced: true
    },
    {
      id: '5',
      studentId: 'ST-2023-005',
      name: 'Lucas Anderson',
      initials: 'LA',
      avatarColor: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      isPresent: false,
      timeIn: '',
      remarks: 'Family emergency',
      synced: true
    },
    {
      id: '6',
      studentId: 'ST-2023-006',
      name: 'Mia Thompson',
      initials: 'MT',
      avatarColor: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      isPresent: true,
      timeIn: '07:45',
      remarks: '',
      synced: true
    },
    {
      id: '7',
      studentId: 'ST-2023-007',
      name: 'Ethan Rodriguez',
      initials: 'ER',
      avatarColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      isPresent: true,
      timeIn: '08:05',
      remarks: '',
      synced: true
    },
    {
      id: '8',
      studentId: 'ST-2023-008',
      name: 'Isabella Chen',
      initials: 'IC',
      avatarColor: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      isPresent: false,
      timeIn: '',
      remarks: 'Sick leave',
      synced: true
    }
  ];

  filteredStudents: StudentAttendance[] = [...this.students];

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.filterStudents();
  }

  onAttendanceChange(studentId: string, isPresent: boolean): void {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.isPresent = isPresent;
      if (!isPresent) {
        student.timeIn = '';
      }
    }
  }

  onTimeInChange(studentId: string, timeIn: string): void {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.timeIn = timeIn;
    }
  }

  onRemarksChange(studentId: string, remarks: string): void {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.remarks = remarks;
    }
  }

  markAllPresent(): void {
    this.students.forEach(student => {
      student.isPresent = true;
      if (!student.timeIn) {
        student.timeIn = '08:00';
      }
    });
  }

  markAllAbsent(): void {
    this.students.forEach(student => {
      student.isPresent = false;
      student.timeIn = '';
    });
  }

  editContext(): void {
    // Implementation for editing attendance context
    console.log('Edit context clicked');
  }

  saveAttendance(): void {
    // Implementation for saving attendance
    console.log('Saving attendance:', this.students);
  }

  private filterStudents(): void {
    if (!this.searchTerm) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(this.searchTerm) ||
        student.studentId.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  getAttendanceStatusClass(isPresent: boolean): string {
    return isPresent ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  }

  getRowClass(isPresent: boolean): string {
    return isPresent ? '' : 'bg-red-50/30 dark:bg-red-900/5';
  }
}
