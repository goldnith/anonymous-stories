import React, { useState, useEffect, useCallback} from "react";
import Popup from "./Popup";
import useUniqueId from "../hooks/useUniqueId";
import "./component.css";


const StoryCard = ({
  _id, // This is your story ID
  title,
  story,
  likeCount: initialLikeCount, 
  likedUsers, 
  commentCount,
  authorName,
  authorDetails,
  category
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(initialLikeCount);
  const userId = useUniqueId();
  
  
  // Ensure we have a valid storyId
  const storyId = _id?.toString();
  const previewStory = story.length > 200 ? story.substring(0, 200) + "..." : story;
  
  // console.log('Story ID in card:', storyId);
  
  useEffect(() => {
    if (likedUsers && userId) {
      setIsLiked(likedUsers.includes(userId));
    }
  }, [likedUsers, userId]);

  const handleCardClick = useCallback(() => {
    setShowPopup(true);
  }, []);

  // const updateLikeStatus = (newCount, newLikedStatus) => {
  //   setCurrentLikeCount(newCount);
  //   setIsLiked(newLikedStatus);
  // };


  return (
    <>
      <div 
        className="story-card"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        <h3>{title}</h3>
        
        {/* Author section with conditional rendering */}
        {authorName && authorName !== 'Anonymous' && (
          <div className="story-author-info">
            <div className="author-header">
              <span className="author-emoji">👽</span>
              <span className="author-name">{authorName}</span>
            </div>
            {authorDetails && (
              <p className="author-details">{authorDetails}</p>
            )}
          </div>
        )}

        <p className="story-preview">{previewStory}</p>

        <div className="card-footer">
          <div className="like-container">
            <span className="like-count">
              {currentLikeCount}
            </span>
            <span className={`heart-icon ${isLiked ? 'liked' : ''}`}>
              {isLiked ? '❤️' : '🤍'}
            </span>
          </div>
          <div className="comments-count">
            <span className="comment-icon">💬</span>
            <span>{commentCount}</span>
          </div>
          <div className="category-tag">
            {category}
          </div>
        </div>
        
        
      </div>
      {showPopup && (
          <Popup 
            storyId={_id}
            setShowPopup={setShowPopup}
          />
        )}
    </>
  );
};

export default StoryCard;