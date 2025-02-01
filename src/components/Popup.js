import React, { useState, useEffect, useRef } from "react";
import "./component.css";
import useUniqueId from "../hooks/useUniqueId";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

function Popup({ story, onClose }) {
  const [displayedText, setDisplayedText] = useState("");
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
  useEffect(() => {
    if (!story?.story) return;
    setDisplayedText("");
    typingIndex.current = 0;

    const interval = setInterval(() => {
      if (typingIndex.current < story.story.length) {
        setDisplayedText((prev) => prev + story.story[typingIndex.current]);
        typingIndex.current += 1;
      } else {
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
        <p>{displayedText}</p>
        <p><strong>Category:</strong> {story.category || "Unknown"}</p>
        <button 
          onClick={handleLikeClick} 
          className={`like-button ${likedByUser ? "liked" : ""}`}
        >
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
