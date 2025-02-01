import React, { useState } from "react";
import Popup from "./Popup";
import "./component.css";

const StoryCard = ({ likeCount, title, story, _id }) => {
  const [showPopup, setShowPopup] = useState(false);
  const previewStory = story.length > 200 ? story.substring(0, 200) + "..." : story;
  const storyId = _id;
  return (
    <div className="story-card"
      onClick={() => setShowPopup(true)}
      style={{ cursor: "pointer", fontSize: "2rem", textAlign: "left" }}
    >
      <h3>{title}</h3>
      <p>{previewStory}</p> {/* Show truncated story */}

      

      {/* ✅ Show Like Count */}
      <p>{likeCount} {likeCount === 1 || 0 ? "Like" : "Likes"}</p>

      {/* ✅ Popup Component */}
      {showPopup && <Popup storyId={storyId} setShowPopup={setShowPopup} />}
    </div>
  );
};

export default StoryCard;