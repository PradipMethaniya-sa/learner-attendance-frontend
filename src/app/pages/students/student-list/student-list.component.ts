import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  className: string;
  gender: string;
  guardianCount: number;
  guardians: { name: string; avatar: string }[];
  faceDataComplete: boolean;
  avatar: string;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentListComponent {
  // Mock data for students
  readonly students: Student[] = [
    {
      id: '1',
      studentId: '#STD-001',
      fullName: 'Alice Johnson',
      email: 'alice.j@school.edu',
      className: 'Grade 10-A',
      gender: 'Female',
      guardianCount: 2,
      guardians: [
        { name: 'John Johnson', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC47yasKICt5TE-jK1Czl1Mayhwf5PLydXlGNXUduqAyQIRCTY5KEu_Dmx4e3e0o_zfJO1v4atLLKDy76p_ipwdc_fKQot5zeN1da6on2DUZJSFhY_D46U4fw2ysiHVJteIinGrZwv7SFwgYXb8qRcqNOVzks7_V7Xwkua4jhMA3g6ByGA-4OFie5qisgxTYxGIpxVMX9nPrCwE1D-Wjk08HqMhVZ7f6Sw9M4H6Q9YQgejdQHp-ls0E-aJNnMuj_nSY6hkGJrir9SC' },
        { name: 'Mary Johnson', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOoIlRwIS-aVMnxb-T5vBFoMm1OB8-HUwBaCVcW2CEKftOGOIbgjVtwsXHGZiQIeWUxKmqk2y5pS-RACzgrXXODAvmyL4-vPO7uQrOQ_g3Ji-3PpSoh-qM3edVpV114KvPNt0JlfWQT1DdwIC2NSsoVtMLSQhvCZ5wBhBG8mrjOTGxA4htA_fXwE1gc4zUJlX7jP32MfMTL7CbNxYp_vSTq0GC7lbG7UQf3Hr4pFx7HkuEdSIt8YIGUudo1dmx0T6eXGj-8XLllLG5' }
      ],
      faceDataComplete: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCclr6tZhecjLch-VGSEdWAg0291sTq6-V56T6rViqTZzy-E2PEBU7sF5QvHGgd29vBmJL6jiXFXfSaMVPsHNGHPjpiZhCX9xJN6srJyrwnYKhwLRz9ItK6CeFIwL6DD_ayDT74nyABE_4CJOPJOCeUIGiOJs6xhUqI6izJa3BejqzBGoVQnoHuJF3J3457ALKldJZyuYlnFUwLjuSIvCNB2iMUeUJ7qbLTeUQS32WON3zl-qZXHliKPBhksHmX6xUbPWh3jGPuZJhM'
    },
    {
      id: '2',
      studentId: '#STD-002',
      fullName: 'Bob Smith',
      email: 'bob.s@school.edu',
      className: 'Grade 10-B',
      gender: 'Male',
      guardianCount: 1,
      guardians: [
        { name: 'Robert Smith', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0gnUTvZcRfvAiCtDKvRVyPG5NvK1G4NMKe7GupOgPQA-fdK4mr8W5KPLzfxHqfMnm6sL3Oz8ifamquxo7Ko79k7bFm3OTeplsh3bQOd4lUy5QrfjkcEfD9KGXzX3NHKJpe2sWwyKwon3uIepSHwQ5wvAAcuXziKTVxCL4P9Us122PIcOfQQ4L9HshZKnhQ5oh0-KlWG2OIQFkU0GNwt9XOrJbTsYHWUbvo5vi4Rv_2iKmjQUlkFd_DKarVzxsL-i3D4moAiCoyYDg' }
      ],
      faceDataComplete: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0gnUTvZcRfvAiCtDKvRVyPG5NvK1G4NMKe7GupOgPQA-fdK4mr8W5KPLzfxHqfMnm6sL3Oz8ifamquxo7Ko79k7bFm3OTeplsh3bQOd4lUy5QrfjkcEfD9KGXzX3NHKJpe2sWwyKwon3uIepSHwQ5wvAAcuXziKTVxCL4P9Us122PIcOfQQ4L9HshZKnhQ5oh0-KlWG2OIQFkU0GNwt9XOrJbTsYHWUbvo5vi4Rv_2iKmjQUlkFd_DKarVzxsL-i3D4moAiCoyYDg'
    },
    {
      id: '3',
      studentId: '#STD-003',
      fullName: 'Charlie Brown',
      email: 'charlie.b@school.edu',
      className: 'Grade 9-A',
      gender: 'Male',
      guardianCount: 3,
      guardians: [
        { name: 'David Brown', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0gnUTvZcRfvAiCtDKvRVyPG5NvK1G4NMKe7GupOgPQA-fdK4mr8W5KPLzfxHqfMnm6sL3Oz8ifamquxo7Ko79k7bFm3OTeplsh3bQOd4lUy5QrfjkcEfD9KGXzX3NHKJpe2sWwyKwon3uIepSHwQ5wvAAcuXziKTVxCL4P9Us122PIcOfQQ4L9HshZKnhQ5oh0-KlWG2OIQFkU0GNwt9XOrJbTsYHWUbvo5vi4Rv_2iKmjQUlkFd_DKarVzxsL-i3D4moAiCoyYDg' },
        { name: 'Sarah Brown', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC47yasKICt5TE-jK1Czl1Mayhwf5PLydXlGNXUduqAyQIRCTY5KEu_Dmx4e3e0o_zfJO1v4atLLKDy76p_ipwdc_fKQot5zeN1da6on2DUZJSFhY_D46U4fw2ysiHVJteIinGrZwv7SFwgYXb8qRcqNOVzks7_V7Xwkua4jhMA3g6ByGA-4OFie5qisgxTYxGIpxVMX9nPrCwE1D-Wjk08HqMhVZ7f6Sw9M4H6Q9YQgejdQHp-ls0E-aJNnMuj_nSY6hkGJrir9SC' },
        { name: 'Linda Brown', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOoIlRwIS-aVMnxb-T5vBFoMm1OB8-HUwBaCVcW2CEKftOGOIbgjVtwsXHGZiQIeWUxKmqk2y5pS-RACzgrXXODAvmyL4-vPO7uQrOQ_g3Ji-3PpSoh-qM3edVpV114KvPNt0JlfWQT1DdwIC2NSsoVtMLSQhvCZ5wBhBG8mrjOTGxA4htA_fXwE1gc4zUJlX7jP32MfMTL7CbNxYp_vSTq0GC7lbG7UQf3Hr4pFx7HkuEdSIt8YIGUudo1dmx0T6eXGj-8XLllLG5' }
      ],
      faceDataComplete: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0gnUTvZcRfvAiCtDKvRVyPG5NvK1G4NMKe7GupOgPQA-fdK4mr8W5KPLzfxHqfMnm6sL3Oz8ifamquxo7Ko79k7bFm3OTeplsh3bQOd4lUy5QrfjkcEfD9KGXzX3NHKJpe2sWwyKwon3uIepSHwQ5wvAAcuXziKTVxCL4P9Us122PIcOfQQ4L9HshZKnhQ5oh0-KlWG2OIQFkU0GNwt9XOrJbTsYHWUbvo5vi4Rv_2iKmjQUlkFd_DKarVzxsL-i3D4moAiCoyYDg'
    }
  ];

  // Filter options
  readonly classes = ['All Classes', 'Grade 10-A', 'Grade 10-B', 'Grade 9-A', 'Grade 11-C'];
  readonly genders = ['All Genders', 'Male', 'Female'];

  // Filter state
  selectedClass = this.classes[0];
  selectedGender = this.genders[0];
  searchTerm = '';

  // Event handlers
  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onClassChange(event: Event): void {
    this.selectedClass = (event.target as HTMLSelectElement).value;
  }

  onGenderChange(event: Event): void {
    this.selectedGender = (event.target as HTMLSelectElement).value;
  }

  exportCSV(): void {
    console.log('Exporting CSV...');
  }

  addNewStudent(): void {
    console.log('Adding new student...');
  }

  viewStudentDetails(student: Student): void {
    console.log('Viewing student details:', student);
  }

  editStudent(student: Student): void {
    console.log('Editing student:', student);
  }

  deleteStudent(student: Student): void {
    console.log('Deleting student:', student);
  }

  viewGuardians(student: Student): void {
    console.log('Viewing guardians for:', student);
  }

  // Get filtered students based on search and filters
  get filteredStudents(): Student[] {
    return this.students.filter(student => {
      const matchesSearch = this.searchTerm === '' || 
        student.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesClass = this.selectedClass === 'All Classes' || student.className === this.selectedClass;
      
      const matchesGender = this.selectedGender === 'All Genders' || 
        student.gender.toLowerCase() === this.selectedGender.toLowerCase();
      
      return matchesSearch && matchesClass && matchesGender;
    });
  }

  // Get class badge color
  getClassBadgeColor(className: string): string {
    switch (className) {
      case 'Grade 10-A':
        return 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300';
      case 'Grade 10-B':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Grade 9-A':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Grade 11-C':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  }
}
