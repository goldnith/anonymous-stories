import axios from 'axios';
import emailjs from '@emailjs/browser';
import { API_URL } from '../config/api';
import { NEWSLETTER_CONFIG } from '../config/newsletter.config';

const apiConfig = {
  headers: {
      'Content-Type': 'application/json'
  },
  timeout: NEWSLETTER_CONFIG.timing.timeout
};

// Track email sending status
const emailTracker = new Map();

export const newsletterService = {
  async getSubscribers() {
    try {
      const response = await axios.get(`${API_URL}/api/subscribers`, apiConfig);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  },

  async addSubscriber(email) {
    try {
      const response = await axios.post(
        `${API_URL}/api/subscribers`,
        { email },
        apiConfig
      );
      
      const { success, message, data } = response.data;
      
      if (!success) {
        throw new Error(message);
      }

      // Return subscription status for different UI handling
      return {
        success: true,
        message,
        status: data.status,
        email: data.email
      };
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Please enter a valid email address');
      }
      throw new Error(error.response?.data?.message || 'Failed to process subscription');
    }
  },

  async removeSubscriber(email) {
    const trackingKey = `unsubscribe_${email}`;
    
    try {
      // Check if we're already processing this email
      if (emailTracker.get(trackingKey)) {
        console.log('Unsubscribe already in progress for:', email);
        return;
      }

      // Mark as processing
      emailTracker.set(trackingKey, true);

      // First remove from database
      const response = await axios.delete(
        `${API_URL}/api/subscribers/${encodeURIComponent(email)}`,
        apiConfig
      );

      if (response.data.success) {
        try {
          // Send farewell email only after successful unsubscribe
          const farewellParams = {
            to_email: email,
            subject: 'Sorry to see you go! 👽',
            message_html: `
              <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000000;">
                <div style="background-color: #000000; color: #ffffff; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #00ffcc; border-radius: 8px;">
                  <h2 style="color: #00ffcc; margin-bottom: 20px;">Farewell, Fellow Alien! 🛸</h2>
                  <p style="margin-bottom: 15px;">You have been successfully unsubscribed from our newsletter.</p>
                  <p style="margin-bottom: 20px;">If you ever want to rejoin our cosmic community, you're always welcome back!</p>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #00ffcc;">
                    <p style="font-style: italic; color: #00ffcc;">Stay weird, stay anonymous! 👽</p>
                  </div>
                </div>
              </div>
            `
          };

          await emailjs.send(
            NEWSLETTER_CONFIG.template.serviceId,
            NEWSLETTER_CONFIG.template.templateId,
            farewellParams,
            NEWSLETTER_CONFIG.template.publicKey
          );
        } catch (emailError) {
          console.error('Error sending farewell email:', emailError);
          // Don't throw here - the unsubscribe was successful
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error removing subscriber:', error);
      throw error;
    } finally {
      // Clear the tracking flag
      emailTracker.delete(trackingKey);
    }
  },

  async sendNewsletterInBatches(subscribers, stories) {
    const { sending, timing, storage } = NEWSLETTER_CONFIG;
    
    try {
      // Check if there's an existing batch in progress
      const savedProgress = localStorage.getItem(storage.batchProgressKey);
      let startBatch = 0;
      
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const lastProcessed = new Date(progress.lastProcessed);
        const now = new Date();
        
        // If last batch was processed within 24 hours, resume from next batch
        if ((now - lastProcessed) < sending.batchDelay) {
          startBatch = progress.currentBatch;
        }
      }
  
      // Split subscribers into batches
      const batches = [];
      for (let i = 0; i < subscribers.length; i += sending.batchSize) {
        batches.push(subscribers.slice(i, i + sending.batchSize));
      }
  
      console.log(`Processing ${subscribers.length} subscribers in ${batches.length} batches, starting from batch ${startBatch + 1}`);
  
      // Process each batch
      for (let i = startBatch; i < batches.length; i++) {
        const batch = batches[i];
        const batchStartTime = new Date();
        
        console.log(`Starting batch ${i + 1}/${batches.length} with ${batch.length} subscribers`);
  
        try {
          await this.sendNewsletter(batch, stories);
          
          // Update progress
          localStorage.setItem(storage.batchProgressKey, JSON.stringify({
            currentBatch: i + 1,
            totalBatches: batches.length,
            lastProcessed: new Date().toISOString(),
            batchStats: {
              processed: batch.length,
              startTime: batchStartTime,
              endTime: new Date()
            }
          }));
  
          // If not last batch, wait for next day
          if (i < batches.length - 1) {
            console.log(`Batch ${i + 1} complete. Waiting 24 hours before next batch...`);
            await new Promise(resolve => setTimeout(resolve, sending.batchDelay));
          }
  
        } catch (error) {
          console.error(`Error processing batch ${i + 1}:`, error);
          throw error;
        }
      }
  
      // Clear progress after successful completion
      localStorage.removeItem(storage.batchProgressKey);
  
      return {
        success: true,
        message: 'Newsletter campaign completed successfully',
        stats: {
          totalSubscribers: subscribers.length,
          totalBatches: batches.length,
          completedAt: new Date().toISOString()
        }
      };
  
    } catch (error) {
      console.error('Newsletter campaign failed:', error);
      throw error;
    }
  },

  async sendNewsletter(subscribers, stories) {
    const { template, timing } = NEWSLETTER_CONFIG;
    
    try {
      // Format stories for email
      const formattedStories = stories.map(story => ({
        title: story.title,
        excerpt: story.content.substring(0, NEWSLETTER_CONFIG.content.excerptLength),
        likes: story.likeCount || 0
      }));
  
      for (const subscriber of subscribers) {
        let attempts = 0;
        
        while (attempts < timing.retryAttempts) {
          try {
            const unsubscribeLink = `${window.location.origin}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
            
            const emailParams = {
              to_email: subscriber.email,
              subject: template.subject,
              head_message: template.greeting,
              stories: formattedStories,
              message_html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${template.styles.backgroundColor};">
                  <div style="color: ${template.styles.textColor}; padding: 20px; font-family: ${template.styles.fontFamily}; border: 1px solid ${template.styles.accentColor}; border-radius: 8px;">
                    <h2 style="color: ${template.styles.accentColor};">${template.greeting}</h2>
                    
                    ${formattedStories.map(story => `
                      <div style="margin: 20px 0; padding: 15px; border: 1px solid ${template.styles.accentColor}; border-radius: 5px;">
                        <h3 style="color: ${template.styles.accentColor};">${story.title}</h3>
                        <p>${story.excerpt}...</p>
                        <small>👽 ${story.likes} aliens liked this</small>
                      </div>
                    `).join('')}
                    
                    ${NEWSLETTER_CONFIG.footerTemplate(subscriber.email)}
                  </div>
                </div>
              `
            };
  
            await emailjs.send(
              template.serviceId,
              template.templateId,
              emailParams,
              template.publicKey
            );
  
            // Add delay between sends to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, timing.rateLimitDelay));
            break; // Success - exit retry loop
  
          } catch (error) {
            attempts++;
            console.error(`Failed to send to ${subscriber.email}, attempt ${attempts}:`, error);
            
            if (attempts === timing.retryAttempts) {
              throw new Error(`Failed to send newsletter to ${subscriber.email} after ${attempts} attempts`);
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, timing.retryDelay));
          }
        }
      }
      
      return { success: true, message: 'Newsletter sent successfully' };
    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw error;
    }
  }
};