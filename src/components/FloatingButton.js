import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Home } from "lucide-react";
import "./component.css";

const FloatingButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const handleClick = () => {
    // Navigate to appropriate route
    navigate(isHomePage ? "/submit" : "/");
    
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <button 
      className="floating-button" 
      onClick={handleClick}
      aria-label={isHomePage ? "Submit Story" : "Go Home"}
    >
      {isHomePage ? <Plus size={28} /> : <Home size={28} />}
    </button>
  );
};

export default FloatingButton;