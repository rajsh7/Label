/**
 * Global application configuration
 * Centralized config values used throughout the application
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'LabelPro',
  description: 'Professional label resizing for e-commerce sellers',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.io',
  version: '2.0.0',
  supportEmail: 'support@labelpro.io',
  salesEmail: 'sales@labelpro.io',
} as const

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  // Enable/disable features
  enableOAuth: true,
  enableBatchProcessing: true,
  enableScheduling: true,
  enableApiAccess: true,
  enableTeamFeatures: true,
  enableReferrals: true,
  enableAnalytics: true,
  enableAds: true, // For free tier
} as const

/**
 * Limits and thresholds
 */
export const APP_LIMITS = {
  // File upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxCsvRows: 10000,
  
  // Batch processing
  maxBatchSize: 10000, // Maximum labels per batch
  batchProcessingTimeout: 300000, // 5 minutes in ms
  
  // API limits
  apiRateLimitFree: 100, // Requests per hour
  apiRateLimitPro: 1000,
  apiRateLimitEnterprise: 2000,
  
  // Template limits
  maxTemplatesFree: 5,
  maxTemplatesPro: 20,
  maxTemplatesEnterprise: 'unlimited',
  
  // Image upload
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Label dimensions
  minLabelSize: 1, // mm
  maxLabelSize: 500, // mm
} as const

/**
 * Timeouts and intervals
 */
export const TIMING_CONFIG = {
  // Auto-save
  autoSaveInterval: 10000, // 10 seconds
  
  // Session
  sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days
  rememberMeTimeout: 90 * 24 * 60 * 60 * 1000, // 90 days
  
  // API
  apiTimeout: 30000, // 30 seconds
  
  // Debounce
  searchDebounce: 300, // ms
  inputDebounce: 500, // ms
} as const

/**
 * Pagination
 */
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const

/**
 * Supported file types
 */
export const FILE_TYPES = {
  csv: ['text/csv', 'application/vnd.ms-excel'],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  pdf: ['application/pdf'],
} as const

/**
 * Supported marketplaces
 */
export const MARKETPLACES = [
  'Amazon',
  'Walmart',
  'eBay',
  'Shopify',
  'Etsy',
  'USPS',
  'FedEx',
  'UPS',
  'DHL',
  'OnTrac',
  'LaserShip',
  'Pitney Bowes',
  'Stamps.com',
  'ShipStation',
] as const

/**
 * Supported printer types
 */
export const PRINTER_TYPES = ['DYMO', 'Zebra', 'Rollo', 'Brother', 'Desktop', 'Other'] as const

/**
 * Supported print methods
 */
export const PRINT_METHODS = ['thermal', 'inkjet', 'desktop'] as const

/**
 * Supported DPIs
 */
export const SUPPORTED_DPIS = [203, 300] as const

/**
 * Barcode formats
 */
export const BARCODE_FORMATS = [
  'CODE128',
  'CODE39',
  'EAN13',
  'EAN8',
  'UPC',
  'ITF14',
  'MSI',
  'pharmacode',
  'codabar',
  'QRCODE',
] as const

/**
 * Default values
 */
export const DEFAULTS = {
  dpi: 203,
  printerType: 'DYMO' as const,
  printMethod: 'thermal' as const,
  barcodeFormat: 'CODE128' as const,
  timezone: 'America/New_York',
  language: 'en',
  currency: 'USD',
} as const

/**
 * Environment
 */
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const

