import emailjs from '@emailjs/browser';
import { NEWSLETTER_CONFIG } from '../config/newsletter.config';

export const sendWeeklyNewsletter = async () => {
  const { template, content, storage } = NEWSLETTER_CONFIG;

  try {
    const subscribers = JSON.parse(localStorage.getItem(storage.subscribersKey) || '[]');
    const stories = JSON.parse(localStorage.getItem('stories') || '[]');
    
    // Validate if we have stories and subscribers
    if (!stories.length) {
      throw new Error('No stories available for newsletter');
    }

    if (!subscribers.length) {
      throw new Error('No subscribers found');
    }

    // Get random stories based on config
    const randomStories = stories
      .sort(() => 0.5 - Math.random())
      .slice(0, content.storiesPerEmail);
    
    // Format stories for email with better HTML structure
    const storiesHTML = `
      <div style="
        background-color: #000;
        color: #fff;
        padding: 20px;
        font-family: Arial, sans-serif;
      ">
        ${randomStories.map(story => `
          <div style="
            margin-bottom: 30px;
            padding: 15px;
            border: 1px solid #00ffcc;
            border-radius: 8px;
            background: rgba(0, 255, 204, 0.05);
          ">
            <h3 style="
              color: #00ffcc;
              margin-bottom: 10px;
              font-size: 18px;
            ">${story.title}</h3>
            <p style="
              color: #ffffff;
              line-height: 1.6;
              font-size: 16px;
            ">${story.content.length > content.maxContentLength 
                ? story.content.substring(0, content.maxContentLength) + '...' 
                : story.content
              }</p>
          </div>
        `).join('')}
      </div>
    `;

    // Send to each subscriber with rate limiting
    for (const subscriber of subscribers) {
      try {
        const templateParams = {
          to_email: subscriber.email,
          subject: template.subject,
          greeting: template.greeting,
          stories: storiesHTML,
          footer: template.footer,
          date: new Date().toLocaleDateString(),
          unsubscribe_link: `${window.location.origin}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
        };

        await emailjs.send(
          template.serviceId,
          template.templateId,
          templateParams,
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        );

        // Add delay between sends to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        continue; // Continue with next subscriber if one fails
      }
    }

    // Update last sent timestamp
    localStorage.setItem(storage.lastSentKey, Date.now().toString());
    return true;
  } catch (error) {
    console.error('Newsletter error:', error);
    throw error; // Rethrow to handle in the component
  }
};