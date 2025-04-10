import React, { useState, useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import Popup from "../components/Popup"; // Import the Popup component
import FloatingButton from "../components/FloatingButton";
import axios from "axios";
import "./pages.css";
import { API_URL } from '../config/api';
import Loader from '../components/Loader';
import { updateMetaDescription } from '../utils/metaDescription';
import TestNewsletter from '../components/TestNewsletter';



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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);

  

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

  const fetchStories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stories`);
      if (response.data && response.data.length > 0) {
        setStories(response.data);
        setContentLoaded(true);
      } else {
        setError("No stories available at the moment. Please check back later.");
      }
    } catch (error) {
      setError("Unable to load stories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (stories.length > 0 && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdsLoaded(true);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [stories]);

  // Add SEO metadata
  useEffect(() => {
    document.title = "Alien Stories - Share Your Anonymous Stories";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 
        'Share and read authentic anonymous stories from around the world. Join our community of storytellers and discover unique experiences.');
    }
  }, []);

  // Add structured data for better SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Alien Stories",
      "description": "Anonymous story sharing platform",
      "url": window.location.origin
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (contentLoaded && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdsLoaded(true);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [contentLoaded]);

  // Initial fetch and polling setup
  useEffect(() => {
    setIsLoading(true);
    fetchStories();

    // Set up polling interval
    const pollInterval = setInterval(fetchStories, 100000); // 10 seconds

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [fetchStories]);

  useEffect(() => {
    if (stories.length > 0) {
      updateMetaDescription(stories);
    }
  }, [stories]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  

  const handleCardClick = (story) => {
    setSelectedStory(story); // Set the selected story
    const scrollPosition = window.scrollY;
    story.scrollPosition = scrollPosition;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleClosePopup = () => {
    setSelectedStory(null); // Clear the selected story
    setTimeout(() => {
      window.scrollTo({
        top: window.scrollY,
        behavior: 'smooth'
      });
    }, 100);
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

  // Split stories into sections
  const topStories = sortedStories.slice(0, 3);
  const remainingStories = sortedStories.slice(3);  

  const renderStoriesWithAds = (stories) => {
    const storyElements = [];
    
    stories.forEach((story, index) => {
      // Add story
      storyElements.push(
        <StoryCard key={story._id} {...story} />
      );

      // Add ad container after every 3rd story
      if ((index + 1) % 3 === 0) {
        storyElements.push(
          <div 
            key={`ad-${index}`} 
            id={`story-ad-${Math.floor(index/3)}`}
            className="story-ad-container native"
          />
        );
      }
    });

    return storyElements;
  };

  

  return (
    <div className={`home ${selectedStory ? 'popup-open' : ''}`}>
      <StarField />
      
      <button 
        className={`scroll-top-button ${showScrollButton ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>

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

          {/* <p className="site-description">
          Share and discover authentic personal stories from around the world. 
          Our community celebrates real experiences in a safe, anonymous environment.
        </p> */}
        </div>
      </div>

      {/* Top Stories Section */}
      <section className="stories-section">
        <div className="stories-grid">
          {topStories.map((story) => {
            const commentCount = story.comments?.length || 0;
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
          })}
        </div>
      </section>

      {/* First Ad Placement */}
      {/* {contentLoaded && (
        <div className="ad-section">
          <div className="ad-container">
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-YOUR_CLIENT_ID"
                 data-ad-slot="YOUR_AD_SLOT_1"
                 data-ad-format="auto"
                 data-full-width-responsive="true">
            </ins>
          </div>
        </div>
      )} */}

      {/* Remaining Stories Section */}
      <section className="stories-section">
        <div className="stories-grid">
          {remainingStories.length > 0 ? (
            remainingStories.map((story) => {
              const commentCount = story.comments?.length || 0;
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
            <p>No more stories found.</p>
          )}
        </div>
      </section>

      {/* Bottom Ad Placement */}
      {/* {contentLoaded && remainingStories.length > 3 && (
        <div className="ad-section">
          <div className="ad-container">
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-YOUR_CLIENT_ID"
                 data-ad-slot="YOUR_AD_SLOT_2"
                 data-ad-format="auto"
                 data-full-width-responsive="true">
            </ins>
          </div>
        </div>
      )} */}

      <TestNewsletter />

      <FloatingButton />

      {/* Render the Popup if a story is selected */}
      {selectedStory && <Popup story={selectedStory} onClose={handleClosePopup} />}



    </div>
  );
}

export default Home;
