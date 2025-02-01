import { useState, useEffect } from 'react';

const useUniqueId = () => {
  const [userId, setUserId] = useState(() => {
    // Try to get existing ID from localStorage
    return localStorage.getItem('user_id') || null;
  });

  useEffect(() => {
    if (!userId) {
      // Generate new ID if none exists
      const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('user_id', newId);
      setUserId(newId);
    }
  }, [userId]);

  return userId;
};

export default useUniqueId;