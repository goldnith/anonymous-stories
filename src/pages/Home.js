import React, { useState, useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import Popup from "../components/Popup"; // Import the Popup component
import FloatingButton from "../components/FloatingButton";
import axios from "axios";
import "./pages.css";
import { API_URL } from "../config/api";
import Loader from "../components/Loader";
import { updateMetaDescription } from "../utils/metaDescription";
import TestNewsletter from "../components/TestNewsletter";

function StarField() {
  return (
    <div className="star-field">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
    </div>
  );
}

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function Home() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null); // Track selected story
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortByLikes, setSortByLikes] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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
    "travel",
  ];

  // Update the fetchStories function
  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = `${API_URL}/api/stories?page=${currentPage}&limit=${storiesPerPage}`;

      // Add search and filter parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (sortByLikes) params.append("sort", "likes");

      // Append parameters to URL
      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      console.log("Fetching from URL:", url);

      const response = await axios.get(url);

      // If response is direct array, paginate it
      if (Array.isArray(response.data)) {
        const start = (currentPage - 1) * storiesPerPage;
        const end = start + storiesPerPage;
        setStories(response.data.slice(start, end));
        setTotalPages(Math.ceil(response.data.length / storiesPerPage));
      }
      // If response has pagination info
      else if (response.data && response.data.stories) {
        setStories(response.data.stories);
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.total / storiesPerPage)
        );
      } else {
        setError("Invalid response format");
        setStories([]);
      }
      setContentLoaded(true);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Unable to fetch stories. Please try again.");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, storiesPerPage, searchTerm, selectedCategory, sortByLikes]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      setCurrentPage(1); // Reset to first page on new search
      setSearchTerm(term);
    }, 500),
    []
  );

  const PaginationControls = () => (
    <div className="pagination-controls">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );

  useEffect(() => {
    if (stories.length > 0 && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdsLoaded(true);
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, [stories]);

  // Add SEO metadata
  useEffect(() => {
    document.title = "Alien Stories - Share Your Anonymous Stories";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Share and read authentic anonymous stories from around the world. Join our community of storytellers and discover unique experiences."
      );
    }
  }, []);

  // Add structured data for better SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Alien Stories",
      description: "Anonymous story sharing platform",
      url: window.location.origin,
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
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
        console.error("AdSense error:", error);
      }
    }
  }, [contentLoaded]);

  // Initial fetch and polling setup
  useEffect(() => {
    fetchStories();

    // Set up polling interval
    const pollInterval = setInterval(fetchStories, 300000); // Every 5 minutes

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [fetchStories, currentPage]); // Add currentPage as dependency

  useEffect(() => {
    if (stories.length > 0) {
      updateMetaDescription(stories);
    }
  }, [stories]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      behavior: "smooth",
    });
  };

  const handleClosePopup = () => {
    setSelectedStory(null); // Clear the selected story
    setTimeout(() => {
      window.scrollTo({
        top: window.scrollY,
        behavior: "smooth",
      });
    }, 100);
  };


  return (
    <div className={`home ${selectedStory ? "popup-open" : ""}`}>
      <StarField />

      <button
        className={`scroll-top-button ${showScrollButton ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      <div className="top-bar">
        <h1>Stories</h1>
        <button
          className={`toggle-controls ${showControls ? "active" : ""}`}
          onClick={() => setShowControls(!showControls)}
        >
          ▼
        </button>
        <div className="controls-wrapper ${showControls ? 'show' : ''}">
          <input
            type="text"
            placeholder="Search stories..."
            className="search-bar"
            onChange={(e) => debouncedSearch(e.target.value)}
            aria-label="Search stories"
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset to first page on category change
            }}
            className="category-filter"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {STORY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <button
            className={`sort-button ${sortByLikes ? "active" : ""}`}
            onClick={() => {
              setSortByLikes(!sortByLikes);
              setCurrentPage(1); // Reset to first page on sort change
            }}
            aria-label={sortByLikes ? "Sort by latest" : "Sort by most liked"}
          >
            {sortByLikes ? "📉 Most Liked" : "⏱️ Latest"}
          </button>
        </div>
      </div>

      <section className="stories-section">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {totalPages > 1 && <PaginationControls />}
            <div className="stories-grid">
              {stories && stories.length > 0 ? (
                stories.map((story) => {
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
                <p className="no-stories">
                  No stories found. Check back later!
                </p>
              )}
            </div>
            {totalPages > 1 && <PaginationControls />}
          </>
        )}
      </section>

      {/* <PaginationControls /> */}

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
      {/* <section className="stories-section">
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
      </section> */}

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
      {selectedStory && (
        <Popup story={selectedStory} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default Home;
