import React, { useState, useEffect } from "react";
import StoryCard from "../components/StoryCard";
import Popup from "../components/Popup"; // Import the Popup component
import FloatingButton from "../components/FloatingButton";
import axios from "axios";
import "./pages.css";

function Home() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null); // Track selected story
  const [searchTerm, setSearchTerm] = useState(""); // Search input state

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stories")
      .then((response) => {
        setStories(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleCardClick = (story) => {
    setSelectedStory(story); // Set the selected story
  };

  const handleClosePopup = () => {
    setSelectedStory(null); // Clear the selected story
  };

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading stories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home">
      <div className="top-bar">
        <h1>Stories</h1>
        <input
          type="text"
          placeholder="Search stories..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="stories-grid">
        {filteredStories.length > 0 ? (
          filteredStories.map((story) => (
            <div key={story.id || story._id} onClick={() => handleCardClick(story)}>
              <StoryCard
                title={story.title}
                story={story.story}
                category={story.category}
              />
            </div>
          ))
        ) : (
          <p>No stories found.</p>
        )}
      </div>

      <FloatingButton />

      {/* Render the Popup if a story is selected */}
      {selectedStory && <Popup story={selectedStory} onClose={handleClosePopup} />}
    </div>
  );
}

export default Home;
