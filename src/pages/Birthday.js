import React, { useState, useEffect } from 'react';
import './pages.css';

function Birthday() {

    const [timeUntilBirthday, setTimeUntilBirthday] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const birthdayDate = new Date('2025-02-16T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const timeLeft = birthdayDate - now;
      
      if (timeLeft <= 0) {
        setShowContent(true);
        return;
      }

      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      setTimeUntilBirthday({ hours, minutes, seconds });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  const generateCrackers = () => {
    return Array(20).fill().map((_, i) => (
      <div 
        key={`cracker-${i}`} 
        className="cracker"
        style={{
          '--delay': `${Math.random() * 2}s`,
          '--x': `${Math.random() * 100}vw`,
          '--color1': `hsl(${Math.random() * 360}deg, 100%, 50%)`,
          '--color2': `hsl(${Math.random() * 360}deg, 100%, 50%)`
        }}
      >
        <div className="cracker-particles"></div>
      </div>
    ));
  };

    
  const generateParticles = () => {
    return Array(50).fill().map((_, i) => (
      <div 
        key={i} 
        className="particle"
        style={{
          '--delay': `${Math.random() * 5}s`,
          '--x': `${Math.random() * 100}vw`
        }}
      />
    ));
  };

  if (!showContent) {
    return (
      <div className="countdown-page">
        <div className="particles-container">
          {generateParticles()}
        </div>
        <div className="countdown-container">
          <h2 className="countdown-title">👽 Cosmic Timeline Until Revelation</h2>
          {timeUntilBirthday && (
            <div className="countdown-timer">
              <span>{String(timeUntilBirthday.hours).padStart(2, '0')}:</span>
              <span>{String(timeUntilBirthday.minutes).padStart(2, '0')}:</span>
              <span>{String(timeUntilBirthday.seconds).padStart(2, '0')}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="birthday-page">
      <div className="particles-container">
        {generateParticles()}
      </div>

      <div className="crackers-container">
        {showContent && generateCrackers()}
      </div>

      <div className="birthday-content">
        <h1 className="birthday-title">🎉 Happy Birthday Rifan! 🎂</h1>
        
        <div className="birthday-message">
            <div className="birthday-image">
                <img src="/rifan.jpg" alt="Birthday Boy Rifan" />
            </div>
          <div className="alien-decoration">
            <span className="large-emoji">👽</span>
          </div>
          
          <div className="message-content">
            <h2>Dear Rifan,</h2>
            <p>Greetings from the cosmic realm! 🌌</p>
            <p>On this special Earth rotation celebration, we wish you:</p>
            <ul className="wish-list">
              <li>✨ Light years of happiness</li>
              <li>🚀 Astronomical success</li>
              <li>💫 Galactic adventures</li>
              <li>🎯 Meteoric achievements</li>
              <li>💝 Interstellar love</li>
              <li> 
                Happy Birthday da rifan eh, i don't know whats in your mind,
                but i hope you have a great day and a great year ahead.
                Be yourself, don't change yourself for anyone, and always be happy.
              </li>
              <li>I'm glad that alien like me got such a good human friendship :)</li>
            </ul>
            <p className="closing-text">May your day be as infinite as space and as bright as a supernova!</p>
            <div className="signature">
              <h2><b>- Your Alien Friend 👽</b></h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Birthday;