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

  async sendNewsletter(subscribers, stories) {
    try {
      const response = await axios.post(
        `${API_URL}/api/newsletter/send`,
        { subscribers, stories },
        apiConfig
      );
      return response.data;
    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw error;
    }
  }
};