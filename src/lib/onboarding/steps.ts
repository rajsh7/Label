/**
 * Onboarding steps configuration
 */

import { OnboardingStep } from '@/components/features/Onboarding/OnboardingTour'

/**
 * Default onboarding steps for new users
 */
export const getDashboardOnboardingSteps = (): OnboardingStep[] => [
  {
    id: 'welcome',
    title: 'Welcome to LabelPro! 🎉',
    description: "Let's take a quick tour to help you get started with creating professional labels.",
    position: 'center',
  },
  {
    id: 'browse-labels',
    title: 'Browse 255+ Label Formats',
    description: 'Click on "Labels" to explore our extensive library of label formats for Amazon, Walmart, eBay, and more.',
    target: 'a[href="/labels"]',
    position: 'right',
    action: {
      label: 'Go to Labels',
      onClick: () => {
        window.location.href = '/labels'
      },
    },
  },
  {
    id: 'create-design',
    title: 'Create Your First Design',
    description: 'Use the editor to design custom labels with text, images, and barcodes. Everything you need is at your fingertips.',
    target: 'a[href="/editor"]',
    position: 'right',
    action: {
      label: 'Open Editor',
      onClick: () => {
        window.location.href = '/editor'
      },
    },
  },
  {
    id: 'batch-processing',
    title: 'Process Labels in Bulk',
    description: 'Upload a CSV file and generate hundreds of labels at once. Perfect for high-volume sellers.',
    target: 'a[href="/batch"]',
    position: 'right',
  },
  {
    id: 'templates',
    title: 'Save and Reuse Templates',
    description: 'Save your favorite designs as templates and reuse them for future label creation.',
    target: 'a[href="/templates"]',
    position: 'right',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: "You're ready to start creating professional labels. Need help? Check out our documentation or contact support.",
    position: 'center',
  },
]

/**
 * Editor onboarding steps
 */
export const getEditorOnboardingSteps = (): OnboardingStep[] => [
  {
    id: 'editor-welcome',
    title: 'Label Editor',
    description: 'This is your label design canvas. Let me show you the key features.',
    position: 'center',
  },
  {
    id: 'tool-panel',
    title: 'Add Elements',
    description: 'Use the tool panel on the left to add text, images, barcodes, and shapes to your label.',
    target: '[data-onboarding="tool-panel"]',
    position: 'right',
  },
  {
    id: 'properties-panel',
    title: 'Customize Properties',
    description: 'Select any element and use the properties panel to customize fonts, colors, sizes, and more.',
    target: '[data-onboarding="properties-panel"]',
    position: 'left',
  },
  {
    id: 'canvas',
    title: 'Design Canvas',
    description: 'Click and drag elements to position them. Use the handles to resize, and right-click for more options.',
    target: '[data-onboarding="canvas"]',
    position: 'top',
  },
  {
    id: 'save',
    title: 'Save Your Work',
    description: 'Always save your designs regularly. You can also download as PDF or print directly.',
    target: '[data-onboarding="save-button"]',
    position: 'bottom',
  },
]

/**
 * Labels browser onboarding steps
 */
export const getLabelsBrowserOnboardingSteps = (): OnboardingStep[] => [
  {
    id: 'labels-welcome',
    title: 'Label Library',
    description: 'Browse through 255+ label formats organized by marketplace, category, and carrier.',
    position: 'center',
  },
  {
    id: 'search-filters',
    title: 'Search & Filter',
    description: 'Use the search bar and filters to quickly find the label format you need.',
    target: '[data-onboarding="label-filters"]',
    position: 'bottom',
  },
  {
    id: 'favorites',
    title: 'Save Favorites',
    description: 'Click the heart icon to save your frequently used labels for quick access.',
    target: '[data-onboarding="favorite-button"]',
    position: 'right',
  },
  {
    id: 'create-from-label',
    title: 'Start Designing',
    description: 'Click on any label to open it in the editor and start creating your design.',
    target: '[data-onboarding="label-card"]',
    position: 'top',
  },
]

