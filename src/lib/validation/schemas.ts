import { z } from 'zod'

/**
 * Validation schemas using Zod
 * Used for form validation and API request validation
 */

// ============================================================================
// User & Auth Schemas
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email is too long')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

export const fullNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')

export const companyNameSchema = z
  .string()
  .max(200, 'Company name is too long')
  .optional()
  .or(z.literal(''))

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: fullNameSchema,
  company_name: companyNameSchema,
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional(),
})

export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

// ============================================================================
// Profile Schemas
// ============================================================================

export const profileUpdateSchema = z.object({
  full_name: fullNameSchema.optional(),
  company_name: companyNameSchema,
  timezone: z.string().optional(),
  language: z.enum(['en', 'es', 'fr', 'de']).optional(),
  notification_preferences: z
    .object({
      email_notifications: z.boolean(),
      batch_complete: z.boolean(),
      system_updates: z.boolean(),
      marketing_emails: z.boolean(),
    })
    .optional(),
})

// ============================================================================
// Label Schemas
// ============================================================================

export const labelIdSchema = z.string().uuid('Invalid label ID format')

export const labelDimensionsSchema = z.object({
  width_mm: z.number().positive('Width must be positive'),
  height_mm: z.number().positive('Height must be positive'),
  width_inch: z.number().positive().optional(),
  height_inch: z.number().positive().optional(),
})

export const labelBaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Label name is required').max(200),
  category: z.string().min(1, 'Category is required'),
  marketplace: z.string().optional(),
  print_method: z.enum(['thermal', 'inkjet', 'desktop']),
  printer_type: z.string().optional(),
  width_mm: z.number().positive(),
  height_mm: z.number().positive(),
  width_inch: z.number().positive().optional(),
  height_inch: z.number().positive().optional(),
  width_px_203dpi: z.number().positive().optional(),
  height_px_203dpi: z.number().positive().optional(),
  width_px_300dpi: z.number().positive().optional(),
  height_px_300dpi: z.number().positive().optional(),
  barcode_position: z.string().optional(),
  barcode_format: z.string().optional(),
  product_reference: z.string().optional(),
  supported_printers: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

// ============================================================================
// Design & Template Schemas
// ============================================================================

export const elementPropertiesSchema = z.record(z.any()) // Flexible for different element types

export const editorElementSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['text', 'image', 'barcode', 'shape']),
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number().min(0).max(360),
  z_index: z.number().int().nonnegative(),
  visible: z.boolean(),
  properties: elementPropertiesSchema,
})

export const designSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Design name is required').max(200),
  label_base_id: z.string().uuid('Invalid label base ID'),
  elements: z.array(editorElementSchema).min(0),
  is_template: z.boolean().default(false),
  dpi: z.enum(['203', '300']).default('203'),
})

export const templateSchema = designSchema.extend({
  is_template: z.literal(true),
  description: z.string().max(500).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// ============================================================================
// Batch Processing Schemas
// ============================================================================

export const columnMappingSchema = z.record(z.string())

export const csvRowSchema = z.record(z.union([z.string(), z.number(), z.boolean()]))

export const batchJobSchema = z.object({
  template_id: z.string().uuid('Invalid template ID'),
  csv_data: z.array(csvRowSchema).min(1, 'CSV data cannot be empty'),
  column_mapping: columnMappingSchema.optional(),
  schedule_at: z.string().datetime().optional(), // ISO 8601 format
})

export const batchJobUpdateSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  error_message: z.string().optional(),
  generated_labels: z.number().nonnegative().optional(),
})

// ============================================================================
// Printer Schemas
// ============================================================================

export const printerTypeSchema = z.enum(['DYMO', 'Zebra', 'Rollo', 'Brother', 'Desktop', 'Other'])

export const connectionTypeSchema = z.enum(['usb', 'network', 'system'])

export const printerSchema = z.object({
  name: z.string().min(1, 'Printer name is required').max(200),
  printer_type: printerTypeSchema,
  connection_type: connectionTypeSchema,
  network_ip: z.string().ip().optional(),
  dpi: z.enum(['203', '300']).default('203'),
  darkness_level: z.number().int().min(0).max(30).default(15),
  label_gap: z.number().positive().default(3),
  is_default: z.boolean().default(false),
})

export const printerUpdateSchema = printerSchema.partial()

// ============================================================================
// API Key Schemas
// ============================================================================

export const apiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(100),
  expires_at: z.string().datetime().optional(),
})

// ============================================================================
// Team Schemas
// ============================================================================

export const teamInviteSchema = z.object({
  email: emailSchema,
  role: z.enum(['member', 'admin']).default('member'),
  message: z.string().max(500).optional(),
})

export const teamUpdateSchema = z.object({
  role: z.enum(['member', 'admin']).optional(),
})

// ============================================================================
// Export Types
// ============================================================================

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type DesignInput = z.infer<typeof designSchema>
export type TemplateInput = z.infer<typeof templateSchema>
export type BatchJobInput = z.infer<typeof batchJobSchema>
export type PrinterInput = z.infer<typeof printerSchema>
export type PrinterUpdateInput = z.infer<typeof printerUpdateSchema>
export type ApiKeyInput = z.infer<typeof apiKeySchema>
export type TeamInviteInput = z.infer<typeof teamInviteSchema>
export type TeamUpdateInput = z.infer<typeof teamUpdateSchema>

