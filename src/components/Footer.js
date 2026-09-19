import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import { newsletterService } from '../services/newsletterService';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [error, setError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscriptionStatus('pending');
    setError(null);
    
    try {
      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if already subscribed
      try {
        const response = await newsletterService.getSubscribers();
        const subscribers = response.data || [];
        
        const existingSubscriber = subscribers.find(sub => 
          sub.email.toLowerCase() === email.toLowerCase() && sub.isActive
        );

        if (existingSubscriber) {
          setError({ message: 'You are already part of our alien community! 👽' });
          setSubscriptionStatus('error');
          return;
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }

      // Add subscriber through API
      const response = await newsletterService.addSubscriber(email);
      
      if (response.warning) {
        setError({ message: response.warning });
        setSubscriptionStatus('error');
        return;
      }

      setSubscriptionStatus('success');
      setEmail('');
      
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error);
      setSubscriptionStatus('error');
      
      // Show specific message for already subscribed users
      if (error.message === 'This email is already subscribed') {
        setError({ message: 'You are already part of our alien community! 👽' });
      }
    }
  };

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // Add useEffect to handle message timeout
  useEffect(() => {
    let timeoutId;
    if (subscriptionStatus === 'success' || subscriptionStatus === 'error') {
      timeoutId = setTimeout(() => {
        setSubscriptionStatus('');
      }, 3000); // Message will disappear after 3 seconds
    }
    return () => clearTimeout(timeoutId);
  }, [subscriptionStatus]);

  return (
    <footer className="alien-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>👽 Alien Stories</h3>
          <p>A safe space for earthlings to share their stories anonymously. Join our intergalactic community of storytellers from across the universe.</p>
          <div className="footer-stats">
            <div className="stat-item">
              <span>🌟 Stories Shared</span>
              <span>20+</span>
            </div>
            <div className="stat-item">
              <span>👥 Community</span>
              <span>500+</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li>
              <a onClick={() => handleNavigation('/about')} style={{ cursor: 'pointer' }}>
                About Us
              </a>
            </li>
            <li>
              <a 
                href="https://buymeacoffee.com/anonymousstoriea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="support-link"
              >
                🚀 Support Our Mission
              </a>
            </li>
            {/* <li>
              <a 
                href="https://stenexeb.xyz/4/9192808" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ad-link"
              >
                🚀 Support Our Mission
              </a>
            </li> */}
            
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal & Privacy</h4>
          <ul>
            <li>
              <a onClick={() => handleNavigation('/privacy')} style={{ cursor: 'pointer' }}>
                🔒 Privacy Policy
              </a>
            </li>
            <li>
              <a onClick={() => handleNavigation('/terms')} style={{ cursor: 'pointer' }}>
                📜 Terms of Use
              </a>
            </li>
            
            
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <ul className="social-links">
            <li>
              <a 
                href="https://X.com/Alien_storiess" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                Follow on 𝕏
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/goldnith" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="github-icon"></i> GitHub
              </a>
            </li>
            <li>
              <a 
                href="mailto:alienstories.contact@gmail.com"
                className="social-link email"
              >
                ✉️ Contact Us
              </a>
            </li>
          </ul>
          <div className="newsletter-signup">
            <h5>Join Our Newsletter</h5>
            <p>Get weekly updates from our alien community!</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for newsletter"
                className={subscriptionStatus}
              />
              <button 
                type="submit"
                disabled={subscriptionStatus === 'pending'}
              >
                {subscriptionStatus === 'pending' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscriptionStatus === 'success' && (
              <p className="success-message">Welcome to our alien community! 🛸</p>
            )}
            {subscriptionStatus === 'error' && (
              <p className="error-message">
                {error?.message || 'Subscription failed. Please try again.'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Made with 🛸 by aliens, for humans | &copy; {currentYear} Alien Stories</p>
        <p className="footer-credits">All stories are anonymously shared by our earthling friends</p>
        <p className="footer-license">
          All rights reserved. This software is proprietary and confidential. 
          <Link 
            to="/terms" 
            className="license-link"
            onClick={() => handleNavigation('/terms')}
          >
            Terms of Use
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
