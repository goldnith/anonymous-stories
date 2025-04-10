import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./Popup.css";
import useUniqueId from "../hooks/useUniqueId";
import axios from "axios";
import { API_URL } from '../config/api';
import CommentSection from "./CommentSection";

const BASE_URL = `${API_URL}`;

const Popup = ({ storyId, setShowPopup }) => {

  const [story, setStory] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [likeCount, setLikes] = useState("0");
  const [likedByUser, setLikedByUser] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useUniqueId();
  

  // Validate props first
  // if (typeof setShowPopup !== 'function') {
  //   console.error('Popup: setShowPopup prop must be a function');
  //   return null;
  // }
  
  // Single validation check for setShowPopup
  // useEffect(() => {
  //   if (typeof setShowPopup !== 'function') {
  //     console.error('Popup: setShowPopup prop must be a function');
  //     return;
  //   }
  // }, [setShowPopup]);

  // Get validated storyId
  const validatedStoryId = useMemo(() => {
    return storyId ? storyId.toString().trim() : null;
  }, [storyId]);

  // Simplified handleClose
  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timeoutId = setTimeout(() => {
      document.body.style.overflow = 'unset'; // Ensure scroll is restored
      setShowPopup(false);
    }, 300);
    return () => {
      clearTimeout(timeoutId);
      document.body.style.overflow = 'unset'; // Cleanup on unmount
    };
  }, [setShowPopup]);

  const fetchStoryData = useCallback(async (id) => {
    if (!id) return null;

    try {
      const response = await axios.get(`${BASE_URL}/api/stories/story/${id}`);
      
      if (!response.data?.story) {
        throw new Error('Invalid story data received');
      }

      return response.data.story;
    } catch (error) {
      console.error('Story fetch error:', error);
      throw error;
    }
  }, []);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  // Scroll lock effect
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Use a small timeout to ensure smooth transition
      const timeoutId = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timeoutId);
    };
  }, []);

  

  

  // Fetch story data
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const loadStory = async () => {
      if (!validatedStoryId) {
        // Safely call setShowPopup
        if (typeof setShowPopup === 'function') {
          setShowPopup(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const storyData = await fetchStoryData(validatedStoryId);
        
        if (!isMounted) return;

        if (!storyData) {
          throw new Error('No story data received');
        }

        const sanitizedStory = {
          _id: storyData._id,
          title: String(storyData.title || ""),
          story: String(storyData.story || ""),
          authorName: String(storyData.authorName || "Anonymous"),
          authorDetails: String(storyData.authorDetails || ""),
          category: String(storyData.category || "Unknown"),
          likeCount: String(storyData.likeCount || "0"),
          likedUsers: Array.isArray(storyData.likedUsers) ? storyData.likedUsers : [],
          createdAt: storyData.createdAt,
          updatedAt: storyData.updatedAt
        };

        if (isMounted) {
          setStory(sanitizedStory);
          setLikes(sanitizedStory.likeCount);
          setLikedByUser(sanitizedStory.likedUsers.includes(userId));
          setDisplayedText(sanitizedStory.story);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Story load error:', error);
          setError(error.message);
          setStory(null);
          // Safely call setShowPopup
          if (typeof setShowPopup === 'function') {
            setShowPopup(false);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStory();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [validatedStoryId, userId, fetchStoryData, setShowPopup]);

  // Handle like click
  const handleLikeClick = async () => {
    if (!validatedStoryId || !userId || isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/stories/${validatedStoryId}/${likedByUser ? "unlike" : "like"}`,
        { userId },
        { 
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setLikes(String(response.data.likeCount));
        setLikedByUser(!likedByUser);
        setStory(prev => ({
          ...prev,
          likeCount: String(response.data.likeCount),
          likedUsers: response.data.likedUsers
        }));
      }
    } catch (error) {
      console.error("Like error:", error);
      setError(String(error?.message || "Failed to update like status"));
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  if (typeof setShowPopup !== 'function') {
    return null;
  }

  // Add early return if no story ID
  if (!validatedStoryId || typeof setShowPopup !== 'function') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="popup-overlay">
        <div className="popup-content loading">
          <button className="popup-close-btn" onClick={handleClose}>✕</button>
          <div className="loading-spinner" />
          <p>Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popup-overlay">
        <div className="popup-content error">
          <button className="popup-close-btn" onClick={handleClose}>✕</button>
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  

  

  if (!story) {
    return null;
  }

  // if (!validatedStoryId) {
  //   return null;
  // }





  return (
    <div 
      className={`popup-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div 
        className={`popup-content ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="popup-close-btn"
          onClick={handleClose}
          aria-label="Close popup"
        >✕</button>

        <h2 className="story-title">{story?.title || "Untitled"}</h2>

        

        <div className="story-content">
          <p className="story-text">{displayedText}</p>
        </div>

        <div className="category-container">
          <span className="category-label">Category:</span>
          <span className="category-tag">{story?.category || "Unknown"}</span>
        </div>

        {story?.authorName && story.authorName !== 'Anonymous' && (
          <div className="popup-author-info">
            <div className="author-header">
              <span className="author-emoji">👽</span>
              <h3 className="author-name">{story.authorName}</h3>
            </div>
            {story.authorDetails && (
              <p className="author-details">{story.authorDetails}</p>
            )}
          </div>
        )}

        <div className="button-container">
          <button 
            onClick={handleLikeClick}
            disabled={isLikeLoading} 
            className={`like-button ${isLikeLoading ? "loading" : ""} ${likedByUser ? "liked" : ""}`}
            aria-label={`${likedByUser ? "Unlike" : "Like"} story`}
          >
            <span className="like-icon">{likedByUser ? "❤️" : "🤍"}</span>
            <span className="like-count">{likeCount}</span>
          </button>
        </div>

        <CommentSection storyId={storyId} />
      </div>
    </div>
  );
};

export default Popup;