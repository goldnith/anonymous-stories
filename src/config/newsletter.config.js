export const NEWSLETTER_CONFIG = {
    // Email template settings
    template: {
      subject: '🛸 Your Weekly Alien Stories Digest',
      greeting: 'Greetings Earthling!',
      footer: 'Stay weird, stay anonymous! 👽',
      templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
      publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
    },
  
    // Newsletter content settings
    content: {
      storiesPerEmail: 3,
      maxContentLength: 500,
      categories: ['featured', 'trending', 'new'],
    },
  
    // Timing settings
    timing: {
      sendInterval: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      retryAttempts: 3,
      retryDelay: 1000, // 1 second
    },
  
    // Storage keys
    storage: {
      subscribersKey: 'newsletter_subscribers',
      lastSentKey: 'newsletter_last_sent',
    },
  
    // Validation
    validation: {
      minEmailLength: 5,
      maxEmailLength: 100,
      emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    }
  };