// Helper functions to trigger real-time notifications

export const triggerNotification = {
  userSignup: () => {
    window.dispatchEvent(new CustomEvent('user:signup'))
  },
  
  templateCreated: () => {
    window.dispatchEvent(new CustomEvent('template:created'))
  },
  
  labelPrinted: () => {
    window.dispatchEvent(new CustomEvent('label:printed'))
  }
}