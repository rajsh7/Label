/**
 * Printer type definitions
 * Based on database schema
 */

export type PrinterConnectionType = 'usb' | 'network' | 'system'
export type PrinterType = 'thermal' | 'inkjet' | 'desktop'
export type SupportedDPI = 203 | 300

export interface Printer {
  id: string
  user_id: string
  name: string
  printer_type: string
  connection_type: PrinterConnectionType
  network_ip?: string
  dpi: SupportedDPI
  darkness_level: number // 0-30
  label_gap: number
  is_default: boolean
  is_online: boolean
  last_status_check?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreatePrinterInput {
  name: string
  printer_type: string
  connection_type: PrinterConnectionType
  network_ip?: string
  dpi?: SupportedDPI
  darkness_level?: number
  label_gap?: number
  is_default?: boolean
}

export interface UpdatePrinterInput {
  name?: string
  printer_type?: string
  connection_type?: PrinterConnectionType
  network_ip?: string
  dpi?: SupportedDPI
  darkness_level?: number
  label_gap?: number
  is_default?: boolean
  is_online?: boolean
}

