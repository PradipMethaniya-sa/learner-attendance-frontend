/**
 * File upload constants - Single source of truth for all file-related configurations
 */
export const FILE_UPLOAD_CONSTANTS = {
  // Allowed image file types
  IMAGE_ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ] as const,

  // File size limits
  MAX_IMAGE_SIZE_MB: 5,

  // Image count limits per entity
  MAX_IMAGES_PER_ENTITY: 5,

  // Error messages
  ERROR_MESSAGES: {
    INVALID_TYPE: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP',
    FILE_TOO_LARGE: (maxSizeMB: number) => `File size exceeds ${maxSizeMB}MB limit`,
    MAX_IMAGES_REACHED: (maxImages: number) => `Maximum ${maxImages} images allowed.`
  }
} as const;
