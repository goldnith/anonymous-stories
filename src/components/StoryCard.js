import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa"; // Import Heart Icon
import useUniqueId from "../hooks/useUniqueId";
import Popup from "./Popup"; // Assuming Popup component exists

const StoryCard = ({ storyId, title, story }) => {
  const [likes, setLikes] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const userId = useUniqueId(); // Unique user ID

  // ✅ Fetch Like Count When Component Mounts
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/stories/${story._id}/likes`);
        const data = await response.json();
        setLikes(data.likeCount);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [storyId]);

  // ✅ Truncate Story for Preview
  const previewStory = story.length > 200 ? story.substring(0, 200) + "..." : story;

  return (
    <div className="story-card"
      onClick={() => setShowPopup(true)}
      style={{ cursor: "pointer", fontSize: "2rem", textAlign: "left" }}
    >
      <h3>{title}</h3>
      <p>{previewStory}</p> {/* Show truncated story */}

      {/* ✅ Open Popup on Click */}
      {/* <div
        onClick={() => setShowPopup(true)}
        style={{ cursor: "pointer", fontSize: "2rem", textAlign: "center" }}
      >
        
      </div> */}

      {/* ✅ Show Like Count */}
      <p>{likes} {likes === 1 ? "Like" : "Likes"}</p>

      {/* ✅ Popup Component */}
      {showPopup && <Popup storyId={storyId} setShowPopup={setShowPopup} />}
    </div>
  );
};

export default StoryCard;
