import React from 'react';
import './terms.css';

function StarField() {
  return (
    <div className="star-field">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
    </div>
  );
}

function Terms() {
  return (
    <div className="policy-container">
      <StarField />
      <h1>Terms and Conditions</h1>
      <div className="policy-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using Alien Stories, you agree to be bound by these Terms and Conditions.</p>
        </section>

        <section>
          <h2>2. User Content Guidelines</h2>
          <p>When submitting stories, users must:</p>
          <ul>
            <li>👽 Share authentic, original content</li>
            <li>👽 Avoid harmful or offensive material</li>
            <li>👽 Not include personal identifying information</li>
            <li>👽 Respect copyright and intellectual property rights</li>
            <li>👽 Not post spam or commercial content</li>
          </ul>
        </section>

        <section>
          <h2>3. Content Moderation</h2>
          <p>Alien Stories reserves the right to:</p>
          <ul>
            <li>👽 Remove content that violates our guidelines</li>
            <li>👽 Suspend or terminate accounts for violations</li>
            <li>👽 Modify or update these terms as needed</li>
          </ul>
        </section>

        <section>
          <h2>4. User Responsibilities</h2>
          <ul>
            <li>👽 Maintain story authenticity and quality</li>
            <li>👽 Report inappropriate content</li>
            <li>👽 Respect other users' privacy</li>
            <li>👽 Not attempt to bypass our security measures</li>
          </ul>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <p>Users retain rights to their stories while granting Alien Stories license to display and distribute the content on our platform.</p>
        </section>

        <section>
          <h2>6. Disclaimer</h2>
          <p>Alien Stories provides the platform "as is" without warranties of any kind, express or implied.</p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>For terms-related inquiries, contact: {' '}
            <a 
              href="mailto:alienstories.contact@gmail.com"
              className="email-link"
            >
              alienstories.contact@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2>8. Updates to Terms</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
}

export default Terms;