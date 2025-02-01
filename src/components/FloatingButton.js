import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react"; // Lucide icon for better UI
import "./component.css"; // Styles for floating button

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button className="floating-button" onClick={() => navigate("/submit")}>
      <Plus size={28} />
    </button>
  );
};

export default FloatingButton;
