import React, { useState, useEffect} from "react";
import Popup from "./Popup";
import useUniqueId from "../hooks/useUniqueId";
import "./component.css";

const StoryCard = ({title, story, _id, likeCount: initialLikeCount, likedUsers}) => {
  const [showPopup, setShowPopup] = useState(false);
  const previewStory = story.length > 200 ? story.substring(0, 200) + "..." : story;
  const storyId = _id;
  const [isLiked, setIsLiked] = useState(false);
  const userId = useUniqueId();
  const [currentLikeCount, setCurrentLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    // Check if current user has liked the story
    if (likedUsers && userId) {
      setIsLiked(likedUsers.includes(userId));
    }
  }, [likedUsers, userId]);

  const updateLikeStatus = (newCount, newLikedStatus) => {
    setCurrentLikeCount(newCount);
    setIsLiked(newLikedStatus);
  };



  return (
    <div className="story-card"
      onClick={() => setShowPopup(true)}
      style={{ cursor: "pointer", fontSize: "2rem", textAlign: "left" }}
    >
      
      <h3>{title}</h3>
      <p>{previewStory}</p> {/* Show truncated story */}

      <div className="like-container">

      <span className="like-count">
          {currentLikeCount}
        </span>
        <span className={`heart-icon ${isLiked ? 'liked' : ''}`}>
          {isLiked ? '❤️' : '🤍'}
        </span>
        
      </div>
      
      {/* ✅ Popup Component */}
      {showPopup && (
        <Popup 
          storyId={storyId} 
          setShowPopup={setShowPopup}
          
          
        />
      )}
    </div>
    
  );
};

export default StoryCard;