import React from 'react';
import './terms.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Alien Stories</h1>
      <div className="about-content">
        <section>
          <h2>Our Mission</h2>
          <p>Alien Stories is a unique platform where earthlings can share their personal experiences anonymously. We believe every story matters and deserves to be heard in a safe, supportive environment.</p>
        </section>

        <section>
          <h2>What Makes Us Different</h2>
          <ul>
            <li>👽 Complete anonymity for all users</li>
            <li>👽 Engaging community interactions</li>
            <li>👽 Safe space for genuine experiences</li>
            <li>👽 Advanced content moderation</li>
            <li>👽 User-friendly alien interface</li>
          </ul>
        </section>

        <section>
          <h2>Community Guidelines</h2>
          <ul>
            <li>👽 Be respectful and supportive to fellow earthlings</li>
            <li>👽 Share authentic, personal experiences</li>
            <li>👽 Maintain complete anonymity - no personal information</li>
            <li>👽 Report inappropriate or harmful content</li>
            <li>👽 Engage constructively in discussions</li>
            <li>👽 Avoid hate speech and discrimination</li>
          </ul>
        </section>

        <section>
          <h2>Content Moderation</h2>
          <p>Our advanced alien technology and dedicated team ensure:</p>
          <ul>
            <li>👽 24/7 content monitoring</li>
            <li>👽 Swift removal of inappropriate content</li>
            <li>👽 Fair and consistent moderation</li>
            <li>👽 Protection of user privacy</li>
          </ul>
        </section>

        <section>
          <h2>Your Privacy Matters</h2>
          <p>We take your privacy seriously. All stories are completely anonymous, and we never collect personal information. Our alien servers use advanced encryption to protect your data.</p>
        </section>

        <section>
          <h2>Support Us</h2>
          <p>Help us keep Alien Stories free and accessible:</p>
          <ul>
            <li>👽 Share your authentic stories</li>
            <li>👽 Engage with the community</li>
            <li>👽 Report violations</li>
            <li>👽 Spread the word about our platform</li>
          </ul>
        </section>

        <section>
          <h2>Connect With Us</h2>
          <p>Questions, feedback, or concerns? Reach out through:</p>
          <ul>
            <li> <p>Email: </p>
              <a 
                href="mailto:alienstories.contact@gmail.com"
                className="contact-link"
              >
                alienstories.contact@gmail.com
              </a>
            </li>
            <li> <p>X: </p>
              <a 
                href="https://twitter.com/Alien_storiess"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                @Alien_storiess
              </a>
            </li>
            <li> <p>GitHub: </p>
              <a 
                href="https://github.com/goldnith"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                github.com/goldnith
              </a>
            </li>
          </ul>
        </section>

        <section className="about-footer">
          <p>Join our growing community of storytellers and make your voice heard! 🛸</p>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
}

export default About;