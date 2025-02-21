// import React, { useState, useEffect, useRef } from 'react';
// import './pages.css';

// function StarField() {
//   return (
//     <div className="star-field">
//       <div className="stars-layer-1"></div>
//       <div className="stars-layer-2"></div>
//       <div className="stars-layer-3"></div>
//     </div>
//   );
// }

// function Birthday() {

//   const [timeUntilBirthday, setTimeUntilBirthday] = useState(null);
//   const [showContent, setShowContent] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null);


//   useEffect(() => {
//     if (showContent) {
//       const timer = setTimeout(() => {
//         toggleAudio();
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [showContent]);



//   // Simplified audio toggle
//   const toggleAudio = async () => {
//     if (audioRef.current) {
//       try {
//         if (isPlaying) {
//           audioRef.current.pause();
//         } else {
//           audioRef.current.muted = false; // Unmute before playing
//           await audioRef.current.play();
//         }
//         setIsPlaying(!isPlaying);
//       } catch (error) {
//         console.error('Audio playback failed:', error);
//         setIsPlaying(false);
//       }
//     }
//   };

//   // Update countdown effect
//   useEffect(() => {
//     const birthdayDate = new Date('2025-02-19T00:00:00'); // Set your target date
    
//     const updateCountdown = () => {
//       const now = new Date();
//       const timeLeft = birthdayDate.getTime() - now.getTime();
      
//       if (timeLeft <= 0) {
//         setShowContent(true);
//         return;
//       }

//       const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
//       setTimeUntilBirthday({ days, hours, minutes, seconds });
//     };

//     // Initial call to avoid delay
//     updateCountdown();
    
//     // Set up interval
//     const timer = setInterval(updateCountdown, 1000);

//     // Cleanup
//     return () => clearInterval(timer);
//   }, []);



//   useEffect(() => {
//     // Hide navigation bar when component mounts
//     document.body.style.overflow = 'hidden';
//     const nav = document.querySelector('nav');
//     if (nav) nav.style.display = 'none';

//     // Restore navigation bar when component unmounts
//     return () => {
//       document.body.style.overflow = 'auto';
//       if (nav) nav.style.display = 'flex';
//     };
//   }, []);

//   const generateCrackers = () => {
//     return Array(20).fill().map((_, i) => (
//       <div 
//         key={`cracker-${i}`} 
//         className="cracker"
//         style={{
//           '--delay': `${Math.random() * 2}s`,
//           '--x': `${Math.random() * 100}vw`,
//           '--color1': `hsl(${Math.random() * 360}deg, 100%, 50%)`,
//           '--color2': `hsl(${Math.random() * 360}deg, 100%, 50%)`
//         }}
//       >
//         <div className="cracker-particles"></div>
//       </div>
//     ));
//   };

    


//     // Add countdown display to your JSX
//   if (!showContent && timeUntilBirthday) {
//     return (
//       <div className="countdown-page">
//         <StarField />
//         <div className="countdown-container">
//           <h2 className="countdown-title">👽 Time Until Birthday Revelation</h2>
//           <div className="countdown-timer">
//             <div className="time-segment">
//               <span>{String(timeUntilBirthday.days).padStart(2, '0')}</span>
//               <label>Days</label>
//             </div>
//             <div className="time-separator">:</div>
//             <div className="time-segment">
//               <span>{String(timeUntilBirthday.hours).padStart(2, '0')}</span>
//               <label>Hours</label>
//             </div>
//             <div className="time-separator">:</div>
//             <div className="time-segment">
//               <span>{String(timeUntilBirthday.minutes).padStart(2, '0')}</span>
//               <label>Minutes</label>
//             </div>
//             <div className="time-separator">:</div>
//             <div className="time-segment">
//               <span>{String(timeUntilBirthday.seconds).padStart(2, '0')}</span>
//               <label>Seconds</label>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="birthday-page">

//       <StarField />
//       <audio
//         ref={audioRef}
//         src="/birthday-music.mp3"
//         loop
//         preload="auto"
        
        
//       />
//       <button 
//         className="audio-control"
//         onClick={toggleAudio}
//         aria-label={isPlaying ? 'Mute music' : 'Play music'}
//       >
//         {isPlaying ? '🔊' : '🔇'}
//       </button>
      

//       <div className="crackers-container">
//         {showContent && generateCrackers()}
//       </div>

//       <div className="birthday-content">
//         <h1 className="birthday-title">🎉 Happy Birthday Kamal eh! 🎂</h1>
        
//         <div className="birthday-message">
//             <div className="birthday-image">
//                 <img src="/kamal.png" alt="Birthday Boy Kamal" />
//             </div>
//           <div className="alien-decoration">
//             <span className="large-emoji">👽</span>
//           </div>
          
//           <div className="message-content">
//             <h2>Dear Kamal,</h2>
//             <p>Greetings from the cosmic realm! 🌌</p>
//             <p>On this special Earth rotation celebration, we wish you:</p>
//             <ul className="wish-list">
//               <li>✨ Light years of happiness</li>
//               <li>🚀 Astronomical success</li>
//               <li>💫 Galactic adventures</li>
//               <li>🎯 Meteoric achievements</li>
//               <li>💝 Interstellar love</li>
//               <li> 
//                 Happy Birthday da Kamal eh, i don't know whats in your mind,
//                 but i hope you have a great day and a great year ahead.
//                 Be yourself, don't change yourself for anyone, and always be happy.
//               </li>
//               <li>I'm glad that alien like me got such a good human friendship :)</li>
//               <li>Sorry for the late wishes :_(</li>
//               <li>💝 I'm there to support you in any situation as a brother/ friend...</li>
//               <li>🐕 Anyways wish you again many more happy returns of the day</li>
//               <li>At last be happy, trip around the world, learn more, improve knowledge, don't kill your kids...lol</li>
//                 <li>🎉 Koodiya seekiram un aala kalyanam panitu life settle agu, illana naa una ponna maathi kalyanam pnipen,...hehe</li>
//               <li>All friends are good, but be concious with some characters, they don't know about your background</li>
//               <li>Enjoy your life as you playing a game... 😀</li>
//               <li>✨ Wishing you to begin year in good way and get more good friends..</li>
//               <li>At last being bad also isn't wrong 😈... Nee panrathunala yarukum keduthal nadakalana athu thappu illa... and dont over think hehe</li>
//               <li>🎂 Once again Happy Birthday to you 🎂, spend precious time in good way...b y e 👋 and Love you my bro 🥰 </li>
//             </ul>
//             <p className="closing-text">May your day be as infinite as space and as bright as a supernova!</p>
//             <div className="signature">
//               <h2><b>- Your Alien Friend 👽</b></h2>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Birthday;