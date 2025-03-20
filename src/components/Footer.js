import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="alien-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>👽 Alien Stories</h3>
          <p>A safe space for earthlings to share their stories anonymously</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li>
              <a 
                href="https://buymeacoffee.com/anonymousstoriea" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Support Us
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li>
              <a 
                href="https://X.com/Alien_storiess" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                x.com
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/goldnith" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Made with 🛸 by aliens, for humans | &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;