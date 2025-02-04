import React, { useState, useEffect, useRef } from "react";
import "./component.css";
import useUniqueId from "../hooks/useUniqueId";
import axios from "axios";

const BASE_URL = "https://anonymous-app-backend.onrender.com";

function Popup({ story, onClose }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIndex = useRef(0);
  const [likeCount, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const userId = useUniqueId();
  const storyId = story?._id;
  
  // ✅ Fetch Like Status
  useEffect(() => {
    if (!storyId || !userId) return;

    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/stories/${storyId}/likes`, { params: { userId } });
        if (response.data) {
          setLikes(response.data.likeCount);
          setLikedByUser(response.data.likedByUser);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
        setLikes(0);
        setLikedByUser(false);
      }
    };

    fetchLikeStatus();
  }, [storyId, userId]);

  // ✅ Typewriter Effect
   // Show complete story initially
   useEffect(() => {
    if (!story?.story) return;
    
    // Set complete story first
    setDisplayedText(story.story);
    
    // Start typing effect
    setIsTyping(true);
    typingIndex.current = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (typingIndex.current < story.story.length) {
        setDisplayedText((prev) => prev + story.story[typingIndex.current]);
        typingIndex.current += 1;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [story?.story]);

  // ✅ Handle Like Action
  const handleLikeClick = async () => {
    if (!storyId || !userId) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/stories/${storyId}/${likedByUser ? "unlike" : "like"}`, { userId });
      if (response.data) {
        setLikes(response.data.likeCount);
        setLikedByUser(!likedByUser);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  if (!story) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{story.title || "Untitled"}</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</p>
        <p>{displayedText}</p>
        <p><strong>Category:</strong> {story.category || "Unknown"}</p>
        <button 
          onClick={handleLikeClick} 
          className={`like-button ${likedByUser ? "liked" : ""}`}
        >
          {likedByUser ? "❤️" : "🤍"} {likeCount} 
          
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
