import emailjs from '@emailjs/browser';
import { NEWSLETTER_CONFIG } from '../config/newsletter.config';

export const sendWeeklyNewsletter = async () => {
  const { template, content, storage } = NEWSLETTER_CONFIG;

  try {
    const subscribers = JSON.parse(localStorage.getItem(storage.subscribersKey) || '[]');
    const stories = JSON.parse(localStorage.getItem('stories') || '[]');
    
    // Get random stories based on config
    const randomStories = stories
      .sort(() => 0.5 - Math.random())
      .slice(0, content.storiesPerEmail);
    
    // Format stories for email
    const storiesHTML = randomStories
      .map(story => `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #00ffcc;">${story.title}</h3>
          <p style="color: #ffffff;">${
            story.content.length > content.maxContentLength 
              ? story.content.substring(0, content.maxContentLength) + '...' 
              : story.content
          }</p>
        </div>
      `).join('');

    // Send to each subscriber
    for (const subscriber of subscribers) {
      const templateParams = {
        to_email: subscriber.email,
        subject: template.subject,
        greeting: template.greeting,
        stories: storiesHTML,
        footer: template.footer,
        date: new Date().toLocaleDateString(),
      };

      await emailjs.send(
        template.serviceId,
        template.templateId,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
    }

    // Update last sent timestamp
    localStorage.setItem(storage.lastSentKey, Date.now().toString());
    return true;
  } catch (error) {
    console.error('Newsletter error:', error);
    return false;
  }
};