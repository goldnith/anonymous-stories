export const NEWSLETTER_CONFIG = {
  // Email template settings
  template: {
    subject: '🛸 Your Weekly Alien Stories Digest',
    greeting: 'Greetings Earthling!',
    footer: 'Stay weird, stay anonymous! 👽',
    serviceId: 'service_yow1wec',
    templateId: 'template_g1swapc',
    publicKey: 'AH-d0-lcWG02jSv6f',
    styles: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      accentColor: '#00ffcc',
      fontFamily: 'Arial, sans-serif',
    }
  },

  // Newsletter content settings
  content: {
    storiesPerEmail: 3,
    maxContentLength: 500,
    categories: ['featured', 'trending', 'new'],
    defaultCategory: 'new',
    excerptLength: 150
  },

  // Timing settings
  timing: {
    sendInterval: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    rateLimitDelay: 1000, // Delay between sends
    timeout: 30000 // 30 seconds timeout
  },

  // Storage keys
  storage: {
    subscribersKey: 'newsletter_subscribers',
    lastSentKey: 'newsletter_last_sent',
    failedAttemptsKey: 'newsletter_failed_attempts'
  },

  // Validation
  validation: {
    minEmailLength: 5,
    maxEmailLength: 100,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxSubscribers: 2000,
    maxRetries: 3
  },

  // Error messages
  errors: {
    invalidEmail: 'Please enter a valid email address',
    maxSubscribersReached: 'Maximum subscriber limit reached',
    sendFailed: 'Failed to send newsletter',
    alreadySubscribed: 'This email is already subscribed'
  }
};