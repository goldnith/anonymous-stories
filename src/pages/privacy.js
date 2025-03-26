import React from 'react';
import './terms.css';

function Privacy() {
  return (
    <div className="policy-container">
      <h1>Privacy Policy</h1>
      <div className="policy-content">
        <section>
          <h2>Information We Collect</h2>
          <p>When you use Alien Stories, we collect:</p>
          <ul>
            <li>👽 Stories you submit anonymously</li>
            <li>👽 Likes and comments</li>
            <li>👽 Device information and cookies</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>👽 To display stories and comments</li>
            <li>👽 To improve our services</li>
            <li>👽 To prevent abuse and maintain security</li>
          </ul>
        </section>

        <section>
          <h2>Cookies and Advertising</h2>
          <p>We use cookies to:</p>
          <ul>
            <li>👽 Remember your preferences</li>
            <li>👽 Analyze site traffic</li>
            <li>👽 Deliver personalized advertisements</li>
          </ul>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>For privacy concerns, contact us at: {' '}
            <a 
              href="mailto:alienstories.contact@gmail.com"
              className="email-link"
            >
              alienstories.contact@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;