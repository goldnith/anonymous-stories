import React, { useState } from "react";
import axios from "axios";
import style from './component.css';

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
      await axios.post("http://localhost:5000/api/stories", formData);
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
        <option value="funny">Funny</option>
        <option value="awkward">Awkward</option>
        <option value="serious">Serious</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}

export default StoryForm;
