import React, { useState } from 'react';
import { sendTestNewsletter } from '../utils/newsletter';
import { API_URL } from '../config/api';

const TestNewsletter = () => {
  const [isSending, setIsSending] = useState(false);

  const handleTestNewsletter = async () => {
    setIsSending(true);
    try {
      // Fetch stories from API
      const response = await fetch(`${API_URL}/api/stories`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories from API');
      }

      const stories = await response.json();
      if (!stories || stories.length === 0) {
        throw new Error('No stories found in the database');
      }

      console.log('Fetched stories:', stories);

      // Sort by likes and get top 3
      const topStories = stories
        .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        .slice(0, 3);

      console.log('Top 3 stories:', topStories);

      await sendTestNewsletter('alienstories.contact@gmail.com', topStories);
      alert('Test newsletter with top stories sent successfully!');
    } catch (error) {
      console.error('Failed to send test newsletter:', error);
      alert(`Failed to send test newsletter: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return process.env.NODE_ENV === 'development' ? (
    <button
      onClick={handleTestNewsletter}
      disabled={isSending}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        background: isSending ? '#666' : '#00ffcc',
        color: '#000',
        border: 'none',
        borderRadius: '5px',
        cursor: isSending ? 'not-allowed' : 'pointer',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}
    >
      {isSending ? 'Sending...' : 'Test Newsletter'}
    </button>
  ) : null;
};

export default TestNewsletter;