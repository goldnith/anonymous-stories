import React, { useEffect, useState } from 'react';
import './component.css';

const Alien = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveAlien = () => {
      const x = Math.random() * (window.innerWidth - 50);
      const y = Math.random() * (window.innerHeight - 50);
      setPosition({ x, y });
    };

    const showAlien = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };

    const moveInterval = setInterval(moveAlien, 1000);
    const appearInterval = setInterval(showAlien, 100000);

    return () => {
      clearInterval(moveInterval);
      clearInterval(appearInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="alien"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="alien-head">
        <div className="antenna-left"></div>
        <div className="antenna-right"></div>
        <div className="alien-eyes">
          <div className="eye left"></div>
          <div className="eye right"></div>
        </div>
      </div>
    </div>
  );
};

export default Alien;