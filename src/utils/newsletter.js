import emailjs from '@emailjs/browser';
import { NEWSLETTER_CONFIG } from '../config/newsletter.config';
import { newsletterApi } from '../config/api';
import { newsletterService } from '../services/newsletterService';

export const sendTestNewsletter = async (testEmail, stories) => {
  try {
    const { template } = NEWSLETTER_CONFIG;

    // Validate email and check subscription
    const subscribers = await getSubscribers();
    const isSubscribed = subscribers.some(sub => sub.email === testEmail);
    if (!isSubscribed) {
      throw new Error('Email is not subscribed to the newsletter');
    }

    // Validate environment configuration
    if (!template.serviceId || !template.templateId || !template.publicKey) {
      throw new Error('Missing email configuration');
    }

    // Validate inputs
    if (!testEmail) {
      throw new Error('Email address is required');
    }
    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      throw new Error('No stories provided for newsletter');
    }

    // Format stories for email with sanitization
    const storiesHTML = stories.map(story => {
      const title = story.title?.trim().replace(/[<>]/g, '') || 'Untitled Story';
      const content = story.story?.trim().replace(/[<>]/g, '') || 'No content available';
      const likes = parseInt(story.likeCount) || 0;

      return `
        <div style="
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid ${template.styles.accentColor};
          border-radius: 8px;
          background: rgba(0, 255, 204, 0.05);
        ">
          <h3 style="color: ${template.styles.accentColor}; margin-bottom: 10px; font-size: 18px;">
            ${title}
          </h3>
          <p style="color: ${template.styles.textColor}; line-height: 1.6; font-size: 16px;">
            ${content.length > 200 ? content.substring(0, 200) + '...' : content}
          </p>
          <div style="color: #666; font-size: 12px; margin-top: 10px;">
            👽 ${likes} ${likes === 1 ? 'alien liked' : 'aliens liked'} this story
          </div>
        </div>
      `;
    }).join('');

    const templateParams = {
      to_email: testEmail,
      subject: process.env.NODE_ENV === 'production' 
        ? template.subject
        : `[TEST] ${template.subject}`,
      message_html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="dark">
          </head>
          <body style="margin: 0; padding: 0; background-color: ${template.styles.backgroundColor};">
            <div style="
              background-color: ${template.styles.backgroundColor}; 
              color: ${template.styles.textColor}; 
              font-family: ${template.styles.fontFamily}; 
              max-width: 600px; 
              margin: 0 auto;
            ">
              <h2 style="color: ${template.styles.accentColor}; text-align: center; padding: 20px; margin: 0;">
                👽 This Week's Most Popular Stories
              </h2>
              <div style="padding: 20px;">
                ${storiesHTML}
              </div>
              <div style="text-align: center; margin-top: 20px; padding: 20px; border-top: 1px solid ${template.styles.accentColor};">
                <p style="color: ${template.styles.accentColor}; margin: 0 0 10px;">${template.footer}</p>
                ${process.env.NODE_ENV !== 'production' ? `
                  <p style="font-size: 12px; color: #ff0000; margin: 10px 0;">
                    ⚠️ This is a test newsletter - do not distribute
                  </p>
                ` : ''}
              </div>
            </div>
          </body>
        </html>
      `,
      footerTemplate: (email) => `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #00ffcc;">
          <p style="font-style: italic; color: #00ffcc;">Stay weird, stay anonymous! 👽</p>
          <p style="font-size: 12px; margin-top: 20px; color: #666;">
            Don't want to receive our transmissions? 
            <a href="${window.location.origin}/unsubscribe?email=${encodeURIComponent(email)}" 
              style="color: #00ffcc; text-decoration: underline;">
              Unsubscribe here
            </a>
          </p>
        </div>
      `
    };

    // Initialize EmailJS
    if (!emailjs.init) {
      emailjs.init(template.publicKey);
    }

    // Send email with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await emailjs.send(
          template.serviceId,
          template.templateId,
          templateParams,
          template.publicKey
        );
        return true;
      } catch (sendError) {
        retries--;
        if (retries === 0) throw sendError;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Send through both EmailJS and backend for redundancy
    const emailjsPromise = emailjs.send(
      template.serviceId,
      template.templateId,
      templateParams,
      template.publicKey
    );

    const backendPromise = newsletterService.sendNewsletter([testEmail], stories);

    await Promise.all([emailjsPromise, backendPromise]);
    return true;

  } catch (error) {
    console.error('Newsletter error:', error);
    throw error;
  }
};

export const getSubscribers = async () => {
  try {
    const response = await newsletterService.getSubscribers();
    return response;
  } catch (error) {
    console.error('Error getting subscribers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch subscribers');
  }
};

export const addSubscriber = async (email) => {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }

    const response = await newsletterService.addSubscriber(email);
    return response;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw new Error(error.response?.data?.message || 'Failed to save subscriber');
  }
};

export const removeSubscriber = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const response = await newsletterService.removeSubscriber(email);
    return response;
  } catch (error) {
    console.error('Error removing subscriber:', error);
    throw new Error(error.response?.data?.message || 'Failed to remove subscriber');
  }
};
