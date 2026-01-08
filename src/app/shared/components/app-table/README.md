# App Table Component

A reusable, standalone table component for Angular 21 applications with server-side pagination, search, and sorting capabilities.

## Features

- ✅ Dynamic columns configuration
- ✅ Server-side pagination
- ✅ Server-side search
- ✅ Server-side sorting (ASC/DESC per column)
- ✅ Loading state
- ✅ Empty state
- ✅ Sort indicator icons
- ✅ Angular 21 control flow syntax (@if, @for)
- ✅ Tailwind CSS v4 styling
- ✅ Dark mode support

## Usage

```typescript
import { TableColumn } from '@/shared/components/app-table';

columns = [
  { key: 'name', label: 'School Name', sortable: true },
  { key: 'registrationNo', label: 'Registration No', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', sortable: true }
];

schools: any[] = [];
page = 1;
limit = 10;
total = 0;
```

```html
<app-table
  [columns]="columns"
  [data]="schools"
  [page]="page"
  [limit]="limit"
  [total]="total"
  [loading]="loading"
  [searchQuery]="searchQuery"
  [currentSort]="{ field: sortBy, order: sortOrder }"
  (searchChange)="onSearch($event)"
  (sortChange)="onSort($event)"
  (pageChange)="onPageChange($event)"
></app-table>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `columns` | `TableColumn[]` | `[]` | Column configuration |
| `data` | `any[]` | `[]` | Table data array |
| `page` | `number` | `1` | Current page number |
| `limit` | `number` | `10` | Items per page |
| `total` | `number` | `0` | Total number of items |
| `loading` | `boolean` | `false` | Loading state |
| `searchQuery` | `string` | `''` | Current search query |
| `currentSort` | `{ field: string; order: 'asc' \| 'desc' }` | `{ field: '', order: 'asc' }` | Current sort configuration |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `searchChange` | `string` | Emitted when search query changes |
| `sortChange` | `{ field: string; order: 'asc' \| 'desc' }` | Emitted when sort changes |
| `pageChange` | `number` | Emitted when page changes |

## TableColumn Interface

```typescript
interface TableColumn {
  key: string;        // Data key to access value
  label: string;      // Column header label
  sortable?: boolean; // Enable sorting (default: false)
}
```

## API Integration Example

```typescript
// Parent component
onSearch(searchQuery: string): void {
  this.searchQuery = searchQuery;
  this.page = 1; // Reset to first page
  this.loadData();
}

onSort(sortChange: { field: string; order: 'asc' | 'desc' }): void {
  this.sortBy = sortChange.field;
  this.sortOrder = sortChange.order;
  this.page = 1; // Reset to first page
  this.loadData();
}

onPageChange(pageNumber: number): void {
  this.page = pageNumber;
  this.loadData();
}

loadData(): void {
  const params = {
    page: this.page,
    limit: this.limit,
    search: this.searchQuery,
    sortBy: this.sortBy,
    orderBy: this.sortOrder
  };
  
  this.apiService.getData(params).subscribe(response => {
    this.data = response.data;
    this.total = response.total;
  });
}
```

## Styling

The component uses Tailwind CSS v4 classes and includes:

- Responsive design
- Dark mode support
- Hover states
- Loading animations
- Empty state illustrations
- Modern admin table UI

## Dependencies

- Angular 21+
- Tailwind CSS v4
- Material Symbols (for icons)
