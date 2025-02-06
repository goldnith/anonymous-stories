import React, { useState, useEffect, useRef } from "react";
import "./component.css";
import useUniqueId from "../hooks/useUniqueId";
import axios from "axios";
import { API_URL } from '../config/api';
import CommentSection from "./CommentSection";

const BASE_URL = `${API_URL}`;

function Popup({ story, onClose }) {
  const [displayedText, setDisplayedText] = useState("");
  const typingIndex = useRef(0);
  const [likeCount, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const userId = useUniqueId();
  const storyId = story?._id;
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);


  const handleOverlayClick = (e) => {
    // Only close if clicking the black overlay
    if (e.target.classList.contains('popup-overlay')) {
      onClose();
    }
  };
  
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

    // Set story text with fade effect
  // Set story text with fade effect
  useEffect(() => {
    if (!story?.story) return;
    setDisplayedText(story.story);
  }, [story?.story]);

  // ✅ Handle Like Action
  const handleLikeClick = async () => {
    if (!storyId || !userId || isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/stories/${storyId}/${likedByUser ? "unlike" : "like"}`,
        { userId },
        { timeout: 5000 } // 5 second timeout
      );
      
      if (response.data) {
        setLikes(response.data.likeCount);
        setLikedByUser(!likedByUser);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  if (!story) return null;

  return (
    <div 
      className="popup-overlay"
      onClick={handleOverlayClick} // Close when clicking overlay
    >
      <div className="popup-content">
        <h2>{story.title || "Untitled"}</h2>
        <p className="story-text" 
          style={{ 
            whiteSpace: 'pre-wrap',
            opacity: displayedText ? 1 : 0,
            transition: 'opacity 1s ease-in'
          }}>
          {displayedText}
        </p>
        <p><strong>Category:</strong> {story.category || "Unknown"}</p>
        <div className="button-container">
          <button 
            onClick={handleLikeClick}
            disabled={isLikeLoading} 
            className={`like-button ${isLikeLoading ? "loading" : ""}`}>
            {likedByUser ? "❤️" : "🤍"} {likeCount}
          </button>
          {/* <button onClick={() => setShowComments(!showComments)}>
            💭 Comments
          </button> */}
          <button onClick={onClose}>Close</button>
        </div>
        {showComments && (
          <CommentSection storyId={story._id} />
        )}
      </div>
    </div>
  );
}

export default Popup;
