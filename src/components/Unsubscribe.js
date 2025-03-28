import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NEWSLETTER_CONFIG } from '../config/newsletter.config';
import './Unsubscribe.css';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const email = searchParams.get('email');

  useEffect(() => {
    const handleUnsubscribe = async () => {
      try {
        if (!email) {
          setStatus('error');
          return;
        }

        // Get current subscribers
        const subscribers = JSON.parse(
          localStorage.getItem(NEWSLETTER_CONFIG.storage.subscribersKey) || '[]'
        );

        // Remove the subscriber
        const updatedSubscribers = subscribers.filter(sub => sub.email !== email);
        
        // Update storage
        localStorage.setItem(
          NEWSLETTER_CONFIG.storage.subscribersKey,
          JSON.stringify(updatedSubscribers)
        );

        setStatus('success');
      } catch (error) {
        console.error('Unsubscribe error:', error);
        setStatus('error');
      }
    };

    handleUnsubscribe();
  }, [email]);

  return (
    <div className="unsubscribe-container">
      <h1>Newsletter Unsubscribe</h1>
      {status === 'processing' && (
        <p>Processing your unsubscribe request...</p>
      )}
      {status === 'success' && (
        <div className="success-message">
          <h2>Successfully Unsubscribed</h2>
          <p>You have been unsubscribed from the Alien Stories newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always subscribe again.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="error-message">
          <h2>Unsubscribe Failed</h2>
          <p>Sorry, we couldn't process your unsubscribe request.</p>
          <p>Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
};

export default Unsubscribe;