import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './pages.css';
import { API_URL } from '../config/api';
import FloatingButton from "../components/FloatingButton";


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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Handle textarea scrolling
    if (name === 'story') {
      const textarea = e.target;
      const selection = textarea.selectionStart;
      const linesBeforeCursor = value.substr(0, selection).split('\n');
      const currentLineNumber = linesBeforeCursor.length;
      
      // Calculate position to scroll to
      const lineHeight = 24; // matches style fontSize
      const scrollPosition = textarea.offsetTop + (currentLineNumber * lineHeight);
      const scrollToY = scrollPosition - (window.innerHeight / 3);

      // Scroll into view
      window.scrollTo({
        top: scrollToY,
        // behavior: 'smooth'
      });
    }
  };
  

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    autoResize();
  }, [formData.story]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/api/stories`, {
        title: formData.title,
        story: formData.story,
        category: formData.category
      });

      setSuccess(true);
      setFormData({ title: "", story: "", category: "" });

      // Show navigation loader before redirecting
      setTimeout(() => {
        setSuccess(false);
        setIsNavigating(true);
        setTimeout(() => navigate("/"), 2000); // Simulating loading time
      }, 200);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-story">
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
        <textarea
          ref={textareaRef}
          name="story"
          placeholder="Your story..."
          value={formData.story}
          onChange={handleChange}
          required
          style={{
            minHeight: '150px',
            fontSize: '16px',
            lineHeight: '24px',
            paddingBottom: '100px',
            scrollMarginTop: '100px'
          }}
          
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <div className="button-loader"></div> : 'Submit Story'}
        </button>
      </form>

      {/* ✅ Floating Success Message */}
      {success && (
        <div className="success-message">
          🎉 Successfully submitted!
        </div>
      )}

      <FloatingButton />
    </div>
  );
}

export default SubmitStory;
