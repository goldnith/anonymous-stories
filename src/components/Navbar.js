import React, { useEffect, useState } from "react";
import "./component.css"; // Ensure you have your CSS file linked
import { RotateCcw } from 'lucide-react';

const alienPhrases = [
  "Decoding extraterrestrial signal...",
  "Uploading alien data...",
  "Welcome to the Galactic Network...",
  "Transmission from Planet X received...",
  "Encrypting cosmic message...",
];

function Navbar() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = alienPhrases[index];
    const speed = isDeleting ? 50 : 100; // Typing speed

    const typingEffect = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % alienPhrases.length);
      }
    }, speed);

    return () => clearTimeout(typingEffect);
  }, [charIndex, isDeleting, index]);

  return (
    <nav>
      <h1>👽 Alien Stories</h1>
      <span className="alien-typing">{text}<span className="cursor">|</span></span>
      <ul>
        <li><a href="https://buymeacoffee.com/anonymousstoriea">Support Us</a></li>
        <li>
          <a href="/" className="refresh-link">
            <RotateCcw size={20} className="refresh-icon" aria-label="Refresh" />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
