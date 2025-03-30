import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { newsletterService } from '../services/newsletterService';
import { NEWSLETTER_CONFIG } from '../config/newsletter.config';
import './Unsubscribe.css';


const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const email = searchParams.get('email');

  useEffect(() => {
    emailjs.init(NEWSLETTER_CONFIG.template.publicKey);

    const handleUnsubscribe = async () => {
      try {
        if (!email) {
          throw new Error('No email provided');
        }

        // Validate email format
        if (!NEWSLETTER_CONFIG.validation.emailPattern.test(email)) {
          throw new Error('Invalid email format');
        }

        // Check subscriber status first
        try {
          const response = await newsletterService.getSubscribers();
          const subscribers = response.data || [];
          
          const isSubscribed = Array.isArray(subscribers) && subscribers.some(sub => 
            sub.email === email && sub.isActive
          );

          if (!isSubscribed) {
            setStatus('error');
            setError('This email is not currently subscribed to our newsletter.');
            return;
          }
        } catch (error) {
          console.error('Error checking subscription status:', error);
          throw new Error('Failed to verify subscription status');
        }

        // Proceed with unsubscribe - email will be sent by the service
        await newsletterService.removeSubscriber(email);
        setStatus('success');
      } catch (error) {
        console.error('Unsubscribe error:', error);
        setError(error.message);
        setStatus('error');
      }
    };

    handleUnsubscribe();
  }, [email]);

  return (
    <div className="alien-unsubscribe-container">
      <h1>Newsletter Unsubscribe</h1>
      {status === 'processing' && (
        <div className="alien-processing-message">
          <p>Processing your unsubscribe request...</p>
          <div className="alien-loading-spinner"></div>
        </div>
      )}
      {status === 'success' && (
        <div className="alien-success-message">
          <h2>Successfully Unsubscribed</h2>
          <p>You have been unsubscribed from the Alien Stories newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always subscribe again.</p>
          <button 
            onClick={() => navigate('/')}
            className="alien-return-home-btn"
          >
            Return to Home
          </button>
        </div>
      )}
      {status === 'error' && (
        <div className="alien-error-message">
          <h2>Unsubscribe Failed</h2>
          <p>{error || "Sorry, we couldn't process your unsubscribe request."}</p>
          <p>Please try again or contact support.</p>
          <button 
            onClick={() => navigate('/')}
            className="alien-return-home-btn"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Unsubscribe;