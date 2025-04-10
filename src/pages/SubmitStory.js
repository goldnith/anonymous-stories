import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './pages.css';
import { API_URL } from '../config/api';
import FloatingButton from "../components/FloatingButton";


function StarField() {
  return (
    <div className="star-field">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
    </div>
  );
}


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

function SubmitStory() {
  const [formData, setFormData] = useState({
    title: "",
    story: "",
    category: "",
    authorName: "",
    authorDetails: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  };
  
  const adjustForKeyboard = () => {
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        document.body.style.height = `${window.visualViewport.height}px`;
      });
    }
  };
  
  useEffect(() => {
    adjustForKeyboard();
  }, []);

  useEffect(() => {
    autoResize();
  }, [formData.story]);

  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Add server ping mechanism
  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/ping`);
        console.log('Server status:', response.data);
      } catch (error) {
        console.error('Server ping failed:', error.message);
      }
    };
  
    pingServer();
  
    // Ping every 2 minutes (120000ms)
    const pingInterval = setInterval(pingServer, 120000);
  
    return () => clearInterval(pingInterval);
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });

    try {
      await axios.post(`${API_URL}/api/stories`, {
        title: formData.title,
        story: formData.story,
        category: formData.category,
        authorName: formData.authorName || 'Anonymous',  // Default to 'Anonymous' if empty
        authorDetails: formData.authorDetails || ''      // Empty string if no details provided
      });

      setSubmitStatus({ loading: false, success: true, error: null });
      setFormData({ 
        title: "", 
        story: "", 
        category: "", 
        authorName: "", 
        authorDetails: "" 
      });

      // Show success message and redirect
      setTimeout(() => {
        setIsNavigating(true);
        setTimeout(() => navigate("/"), 2000);
      }, 1500);
      
    } catch (err) {
      setSubmitStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || 'Failed to submit story'
      });
    }
  };

  return (
    <div className="submit-story">
      <StarField />

      {/* Loading Overlay */}
      {submitStatus.loading && (
        <div className="loading1-overlay">
          <div className="loading1-content">
            <div className="alien-loader1"></div>
            <p>Transmitting your story to alien servers...</p>
          </div>
        </div>
      )}

      {isNavigating && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Redirecting to Home...</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2>Submit Your Story</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          name="title"
          placeholder="Story Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="authorName"
          placeholder="Author Name (optional)"
          value={formData.authorName}
          onChange={handleChange}
          className="optional-field"
        />
        <textarea
          // onFocus={handleFocus}
          ref={textareaRef}
          name="story"
          placeholder="Your story..."
          value={formData.story}
          onChange={handleChange}
          required
        />
        {/* Add author details field */}
        <textarea
          name="authorDetails"
          placeholder="Author Details (optional) - Tell us a bit about yourself..."
          value={formData.authorDetails}
          onChange={handleChange}
          className="optional-field author-details"
        />
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {STORY_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <button 
          type="submit" 
          disabled={submitStatus.loading}
          className={submitStatus.loading ? 'loading' : ''}
        >
          {isSubmitting ? <div className="button-loader1"></div> : 'Submit Story'}
        </button>
      </form>

      {/* ✅ Floating Success Message */}
      {submitStatus.success && (
        <div className="success-message">
          <span>🛸</span>
          Story successfully transmitted!
        </div>
      )}

      <FloatingButton />
    </div>
  );
}

export default SubmitStory;
