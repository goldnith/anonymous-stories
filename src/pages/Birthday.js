import React, { useState, useEffect, useRef } from 'react';
import './pages.css';

function StarField() {
  return (
    <div className="star-field">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
    </div>
  );
}

function Birthday() {

  const [timeUntilBirthday, setTimeUntilBirthday] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Handle audio playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Add audio effect when content is revealed
  useEffect(() => {
    if (showContent && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.log('Autoplay prevented:', e);
            setIsPlaying(false);
          });
      }
    }
  }, [showContent]);

  useEffect(() => {
    const birthdayDate = new Date('2025-02-15T19:30:00');
    
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

  useEffect(() => {
    // Hide navigation bar when component mounts
    document.body.style.overflow = 'hidden';
    const nav = document.querySelector('nav');
    if (nav) nav.style.display = 'none';

    // Restore navigation bar when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
      if (nav) nav.style.display = 'flex';
    };
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

    


  if (!showContent) {
    return (
      <div className="countdown-page">
        
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

      <StarField />
      <audio
        ref={audioRef}
        src="/birthday-music.mp3"
        loop
      />
      <button 
        className="audio-control"
        onClick={toggleAudio}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
      

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