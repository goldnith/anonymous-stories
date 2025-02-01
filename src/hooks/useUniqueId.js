import { useState, useEffect } from 'react';

const useUniqueId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', id);
    }
    setUserId(id);
  }, []);

  return userId;
};

export default useUniqueId;
