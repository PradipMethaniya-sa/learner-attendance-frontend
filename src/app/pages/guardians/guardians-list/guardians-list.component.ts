import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

export interface Guardian {
  id: string;
  guardianId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  district: string;
  initials: string;
  avatarColor: string;
}

@Component({
  selector: 'app-guardians-list',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './guardians-list.component.html',
  styleUrls: ['./guardians-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuardiansListComponent {
  // Search form data
  phoneNumber = '';
  email = '';
  nationalId = '';

  // Mock data for guardians
  readonly guardians: Guardian[] = [
    {
      id: '1',
      guardianId: '#G-1024',
      fullName: 'Sarah Jenkins',
      phoneNumber: '+1 555-0199',
      email: 'sarah.j@example.com',
      district: 'North District',
      initials: 'SJ',
      avatarColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    {
      id: '2',
      guardianId: '#G-1025',
      fullName: 'Michael Ross',
      phoneNumber: '+1 555-2421',
      email: 'mike.ross@example.com',
      district: 'West District',
      initials: 'MR',
      avatarColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    },
    {
      id: '3',
      guardianId: '#G-1029',
      fullName: 'Emma Lewis',
      phoneNumber: '+1 555-8822',
      email: 'emma.l@example.com',
      district: 'North District',
      initials: 'EL',
      avatarColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    }
  ];

  // Filtered guardians based on search
  filteredGuardians: Guardian[] = [...this.guardians];

  // Event handlers
  onPhoneNumberChange(event: Event): void {
    this.phoneNumber = (event.target as HTMLInputElement).value;
    this.filterGuardians();
  }

  onEmailChange(event: Event): void {
    this.email = (event.target as HTMLInputElement).value;
    this.filterGuardians();
  }

  onNationalIdChange(event: Event): void {
    this.nationalId = (event.target as HTMLInputElement).value;
    this.filterGuardians();
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.filterGuardians();
  }

  onReset(): void {
    this.phoneNumber = '';
    this.email = '';
    this.nationalId = '';
    this.filteredGuardians = [...this.guardians];
  }

  addNewGuardian(): void {
    console.log('Adding new guardian...');
  }

  viewGuardianProfile(guardian: Guardian): void {
    console.log('Viewing guardian profile:', guardian);
  }

  editGuardian(guardian: Guardian): void {
    console.log('Editing guardian:', guardian);
  }

  private filterGuardians(): void {
    this.filteredGuardians = this.guardians.filter(guardian => {
      const matchesPhone = this.phoneNumber === '' || 
        guardian.phoneNumber.toLowerCase().includes(this.phoneNumber.toLowerCase());
      
      const matchesEmail = this.email === '' || 
        guardian.email.toLowerCase().includes(this.email.toLowerCase());
      
      const matchesNationalId = this.nationalId === ''; // National ID search would be implemented
      
      return matchesPhone && matchesEmail && matchesNationalId;
    });
  }

  // Get district badge color
  getDistrictBadgeColor(district: string): string {
    switch (district) {
      case 'North District':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'West District':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'East District':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'South District':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
}
