import React, { useState, useEffect, useRef } from "react";
import "./component.css";
import useUniqueId from "../hooks/useUniqueId"; // ✅ Correct import

function Popup({ story, onClose }) {
  const [displayedText, setDisplayedText] = useState("");
  const typingIndex = useRef(0);
  const [likes, setLikes] = useState(story?.likeCount || 0);
  const [likedByUser, setLikedByUser] = useState(false);
  const userId = useUniqueId(); // ✅ Get unique user ID

  const title = story?.title || "Untitled";
  const content = story?.story || ""; // ✅ Ensure content is always a string
  const category = story?.category || "Unknown";

  // ✅ Simulated Typewriter Effect
  useEffect(() => {
    if (!content) return;

    setDisplayedText(""); // Reset text
    typingIndex.current = 0;

    const interval = setInterval(() => {
      if (typingIndex.current < content.length) {
        setDisplayedText((prev) => prev + content[typingIndex.current]);
        typingIndex.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content]);

  // ✅ Fetch Like Status When Popup Opens
  useEffect(() => {
    if (!story) return;

    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/stories/${story._id}/likes`);
        const data = await response.json();
        setLikes(data.likeCount);
        setLikedByUser(data.likedUsers.includes(userId));
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [story]); // ✅ Only fetch likes when `story` changes

  // ✅ Handle Like Button Click
  const handleLikeClick = async () => {
    try {
      const url = likedByUser
        ? `/api/stories/${story._id}/unlike`
        : `/api/stories/${story._id}/like`;

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      setLikes((prevLikes) => (likedByUser ? prevLikes - 1 : prevLikes + 1));
      setLikedByUser(!likedByUser);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  if (!story) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{title}</h2>
        <p>{displayedText}</p>
        <p><strong>Category:</strong> {category}</p>
        <p>
          <strong>Likes:</strong> {likes}{" "}
          <span
            role="img"
            aria-label="heart"
            style={{ fontSize: "2rem", cursor: "pointer" }}
            onClick={handleLikeClick}
          >
            {likedByUser ? "❤️" : "🤍"}
          </span>
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
