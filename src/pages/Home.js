import React, { useState, useEffect } from "react";
import StoryCard from "../components/StoryCard";
import Popup from "../components/Popup"; // Import the Popup component
import FloatingButton from "../components/FloatingButton";
import axios from "axios";
import "./pages.css";
import { API_URL } from '../config/api';
import Loader from '../components/Loader';
import { updateMetaDescription } from '../utils/metaDescription';



function StarField() {
  return (
    <div className="star-field">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
    </div>
  );
}

function Home() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null); // Track selected story
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortByLikes, setSortByLikes] = useState(false);
  const [showControls, setShowControls] = useState(false);
  

  const STORY_CATEGORIES = [
    "funny",
    "awkward",
    "serious",
    "embarrassing", 
    "scary",
    "romantic",
    "mysterious",
    "confession",
    "lifechanging",
    "random",
    "heartwarming",
    "inspirational",
    "adventure",
    "childhood",
    "workplace",
    "family",
    "friendship",
    "school",
    "college",
    "travel"
  ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/api/stories`)
      .then((response) => {
        setStories(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      updateMetaDescription(stories);
    }
  }, [stories]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  const handleCardClick = (story) => {
    setSelectedStory(story); // Set the selected story
  };

  const handleClosePopup = () => {
    setSelectedStory(null); // Clear the selected story
  };

  // const filteredStories = stories.filter((story) =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // if (isLoading) return <div>Loading stories...</div>;
  // if (error) return <div>Error: {error}</div>;



  // Filter stories based on search and category
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          story.story.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });



  // Sort stories by likes
  const sortedStories = filteredStories.sort((a, b) => {
    if (sortByLikes) {
      return Number(b.likeCount) - Number(a.likeCount);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="home">
      <StarField />
      
      
      <div className="top-bar">
        
        <h1>Stories</h1>
        <button 
          className={`toggle-controls ${showControls ? 'active' : ''}`}
          onClick={() => setShowControls(!showControls)}
        >
          ▼
        </button>
        <div className={`controls-wrapper ${showControls ? 'show' : ''}`}>
          <input
            type="text"
            placeholder="Search stories..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {STORY_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <button 
            className={`sort-button ${sortByLikes ? 'active' : ''}`}
            onClick={() => setSortByLikes(!sortByLikes)}
          >
            {sortByLikes ? '📉 Most Liked' : '⏱️ Latest'}
          </button>
        </div>
      </div>

      

      <div className="stories-grid">
        {sortedStories.length > 0 ? (
          sortedStories.map((story) => {
            const commentCount = story.comments ? story.comments.length : 0;
            
            return (
              <div key={story._id} onClick={() => handleCardClick(story)}>
                <StoryCard
                  _id={story._id}
                  title={story.title}
                  story={story.story}
                  category={story.category}
                  likeCount={story.likeCount}
                  likedUsers={story.likedUsers}
                  commentCount={commentCount}
                  comments={story.comments}
                />
              </div>
            );
          })
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
