import React, { useState, useEffect } from 'react';
import { newsletterService } from '../services/newsletterService';
import { API_URL } from '../config/api';

const TestNewsletter = () => {
  const [isSending, setIsSending] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load subscribers when component mounts
    const loadSubscribers = async () => {
      try {
        const subs = await newsletterService.getSubscribers();
        setSubscribers(subs);
        setError(null);
      } catch (error) {
        console.error('Failed to load subscribers:', error);
        setError('Failed to load subscribers');
        setSubscribers([]);
      }
    };
    loadSubscribers();
  }, []); // Remove duplicate useEffect

  const handleTestNewsletter = async () => {
    setIsSending(true);
    setError(null);
    try {
      // Check if we have subscribers
      if (subscribers.length === 0) {
        throw new Error('No subscribers found. Add subscribers first.');
      }

      // Fetch stories from API
      const response = await fetch(`${API_URL}/api/stories`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories from API');
      }

      const stories = await response.json();
      if (!stories || stories.length === 0) {
        throw new Error('No stories found in the database');
      }

      // Sort by likes and get top 3
      const topStories = stories
        .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        .slice(0, 3);

      console.log('Sending newsletter with top stories:', topStories);

      // Send newsletter using the service
      await newsletterService.sendNewsletter(subscribers, topStories);
      alert('Newsletter sent successfully to all subscribers!');

    } catch (error) {
      console.error('Failed to send test newsletter:', error);
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return process.env.NODE_ENV === 'development' ? (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <div style={{ 
        marginBottom: '10px', 
        fontSize: '12px', 
        color: error ? '#ff4444' : '#00ffcc' 
      }}>
        {error || `${subscribers.length} subscribers`}
      </div>
      <button
        onClick={handleTestNewsletter}
        disabled={isSending || error}
        style={{
          padding: '10px 20px',
          background: isSending ? '#666' : error ? '#ff4444' : '#00ffcc',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: (isSending || error) ? 'not-allowed' : 'pointer',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        {isSending ? 'Sending...' : error ? 'Error' : 'Test Newsletter'}
      </button>
    </div>
  ) : null;
};

export default TestNewsletter;