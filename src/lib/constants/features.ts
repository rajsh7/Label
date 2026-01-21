/**
 * Feature flags and feature definitions
 * Re-export from featureGates for consistency
 */

export * from '../features/featureGates'

/**
 * Feature names as constants
 */
export const FEATURES = {
  SCHEDULING: 'schedule_batch',
  API_ACCESS: 'use_api',
  WMS_INTEGRATION: 'wms_integration',
  TEAM_MEMBERS: 'add_team_member',
  BATCH_PROCESSING: 'create_batch',
  LABEL_CREATION: 'create_label',
  PRINT_SCHEDULING: 'schedule_print',
} as const

/**
 * Feature descriptions for UI
 */
export const FEATURE_DESCRIPTIONS: Record<string, string> = {
  [FEATURES.SCHEDULING]: 'Schedule batch jobs to run automatically',
  [FEATURES.API_ACCESS]: 'Access LabelPro via REST API',
  [FEATURES.WMS_INTEGRATION]: 'Integrate with warehouse management systems',
  [FEATURES.TEAM_MEMBERS]: 'Add team members to collaborate',
  [FEATURES.BATCH_PROCESSING]: 'Process multiple labels at once',
  [FEATURES.LABEL_CREATION]: 'Create and edit label designs',
  [FEATURES.PRINT_SCHEDULING]: 'Schedule print jobs',
}

