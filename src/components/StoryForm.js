import React, { useState } from "react";
import axios from "axios";
import style from './component.css';

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

function StoryForm() {
  const [formData, setFormData] = useState({
    title: "",
    story: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://anonymous-app-backend.onrender.com/api/stories", formData);
      alert("Story submitted successfully!");
      setFormData({ title: "", story: "", category: "" });
    } catch (error) {
      console.error("Error submitting story:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Story Title"
        value={formData.title}
        onChange={handleChange}
      />
      <textarea
        name="story"
        placeholder="Your story..."
        value={formData.story}
        onChange={handleChange}
      />
      <select name="category" value={formData.category} onChange={handleChange}>
        
        <option value="">Select a category</option>
          {STORY_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}

export default StoryForm;
