import React, { useEffect, useState, useCallback } from 'react';
import './Alien.css';

const Alien = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Handle alien movement with smooth transition
  const moveAlien = useCallback(() => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 150);
    setPosition({ x, y });
  }, []);

  // Handle alien blinking
  const blink = useCallback(() => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 200);
  }, []);

  // Control alien visibility and animations
  useEffect(() => {
    // Initial position
    moveAlien();

    // Set up intervals for movement and blinking
    const moveInterval = setInterval(moveAlien, 5000);
    const blinkInterval = setInterval(blink, 3000);
    const visibilityInterval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 8000);

    // Cleanup intervals
    return () => {
      clearInterval(moveInterval);
      clearInterval(blinkInterval);
      clearInterval(visibilityInterval);
    };
  }, [moveAlien, blink]);

  if (!isVisible) return null;

  return (
    <div 
      className={`alien ${isVisible ? 'visible' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="alien-body">
        <div className="alien-head">
          <div className="antenna-container">
            <div className="antenna antenna-left"></div>
            <div className="antenna antenna-right"></div>
          </div>
          <div className="alien-face">
            <div className="alien-eyes">
              <div className={`eye left ${isBlinking ? 'blink' : ''}`}>
                <div className="pupil"></div>
              </div>
              <div className={`eye right ${isBlinking ? 'blink' : ''}`}>
                <div className="pupil"></div>
              </div>
            </div>
            <div className="alien-mouth"></div>
          </div>
        </div>
        <div className="alien-neck"></div>
      </div>
    </div>
  );
};

export default Alien;