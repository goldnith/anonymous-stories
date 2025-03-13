import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  
  const messages = [
    'Scanning Earth signals...',
    'Encrypting alien data...',
    'Calibrating quantum transponder...',
    'Bypassing human firewalls...',
    'Establishing cosmic connection...',
    'Hey human, Youl looks different today...',
    'Dont embarassed, I am just kidding...',
    'I am not watching you :)...'
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentMessage = messages[messageIndex];

      if (isDeleting) {
        setText(currentMessage.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setText(currentMessage.substring(0, charIndex + 1));
        charIndex++;
      }

      if (!isDeleting && charIndex === currentMessage.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 1500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
      }
    };

    const typingInterval = setInterval(typeWriter, 100);
    return () => clearInterval(typingInterval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="alien-emoji">👽</div>
        <div className="typing-container">
          <span className="typing-text">{text}</span>
          <span className="cursor"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;