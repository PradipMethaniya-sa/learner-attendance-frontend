export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  actions?: boolean;
  type?: 'text' | 'image' | 'badge' | 'date' | 'custom';
  imageKey?: string; // For image columns, which property contains the image URL
  imageFallback?: string; // Fallback image URL if no image
  imageClass?: string; // CSS class for image
  badgeClass?: (value: any) => string; // Dynamic badge class
  formatDate?: string; // Date format for date type
  customTemplate?: (item: any) => string; // Custom template for complex cells
}
