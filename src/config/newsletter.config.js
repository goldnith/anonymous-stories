export const NEWSLETTER_CONFIG = {
  // Email template settings
  template: {
    subject: '🛸 Your Weekly Alien Stories Digest',
    greeting: 'Greetings Earthling!',
    footer: 'Stay weird, stay anonymous! 👽',
    serviceId: 'service_yow1wec',
    templateId: 'template_g1swapc',
    publicKey: 'AH-d0-lcWG02jSv6f',
    unsubscribeText: "Don't want to receive our transmissions?",
    unsubscribeStyle: {
      fontSize: '12px',
      marginTop: '20px',
      color: '#666666',
      linkColor: '#00ffcc'
    },
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

  // Email sending limits and scheduling
  sending: {
    // Monthly schedule
    interval: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    batchSize: 400, // Maximum emails per day
    dailyLimit: 500, // EmailJS daily limit
    batchDelay: 24 * 60 * 60 * 1000, // 24 hours between batches
    startTime: '02:00', // Start sending at 2 AM
    timeZone: 'UTC',
  },

  // Timing settings for individual sends
  timing: {
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    rateLimitDelay: 500, // 0.5 second delay between sends
    timeout: 30000, // 30 seconds timeout
    batchTimeout: 2 * 60 * 60 * 1000 // 2 hours max for batch processing
  },

  // Storage keys for tracking sends
  storage: {
    subscribersKey: 'newsletter_subscribers',
    lastSentKey: 'newsletter_last_sent',
    failedAttemptsKey: 'newsletter_failed_attempts',
    currentBatchKey: 'newsletter_current_batch',
    batchProgressKey: 'newsletter_batch_progress',
    monthlyStatsKey: 'newsletter_monthly_stats'
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
  },

  // Batch processing status
  status: {
    pending: 'PENDING',
    processing: 'PROCESSING',
    completed: 'COMPLETED',
    failed: 'FAILED',
    paused: 'PAUSED'
  }
};