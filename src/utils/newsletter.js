import emailjs from '@emailjs/browser';
import { NEWSLETTER_CONFIG } from '../config/newsletter.config';

export const sendTestNewsletter = async (testEmail, stories) => {
  try {
    // Validate inputs
    if (!testEmail) {
      throw new Error('Email address is required');
    }
    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      throw new Error('No stories provided for newsletter');
    }

    // Format stories for email with better error handling
    const storiesHTML = stories.map(story => {
      // Sanitize story data
      const title = story.title?.trim() || 'Untitled Story';
      const content = story.story?.trim() || 'No content available';
      const likes = parseInt(story.likeCount) || 0;

      return `
        <div style="
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #00ffcc;
          border-radius: 8px;
          background: rgba(0, 255, 204, 0.05);
        ">
          <h3 style="color: #00ffcc; margin-bottom: 10px; font-size: 18px;">
            ${title}
          </h3>
          <p style="color: #ffffff; line-height: 1.6; font-size: 16px;">
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
      subject: '🛸 This Week\'s Top Alien Stories',
      message_html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #000000;">
            <div style="background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00ffcc; text-align: center; padding: 20px; margin: 0;">
                👽 This Week's Most Popular Stories
              </h2>
              <div style="padding: 20px;">
                ${storiesHTML}
              </div>
              <div style="text-align: center; margin-top: 20px; padding: 20px; border-top: 1px solid #00ffcc;">
                <p style="color: #00ffcc; margin: 0 0 10px;">Stay weird, stay anonymous! 👽</p>
                <p style="font-size: 12px; color: #666; margin: 0;">
                  This is a test newsletter featuring our top stories
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Initialize EmailJS if not already initialized
    if (!emailjs.init) {
      emailjs.init('AH-d0-lcWG02jSv6f');
    }

    // Send email with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await emailjs.send(
          'service_yow1wec',
          'template_g1swapc',
          templateParams,
          'AH-d0-lcWG02jSv6f'
        );
        return true;
      } catch (sendError) {
        retries--;
        if (retries === 0) throw sendError;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error('Test newsletter error:', error);
    throw error;
  }
};