import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Home } from "lucide-react";
import "./component.css";

const FloatingButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <button 
      className="floating-button" 
      onClick={() => navigate(isHomePage ? "/submit" : "/")}
      aria-label={isHomePage ? "Submit Story" : "Go Home"}
    >
      {isHomePage ? <Plus size={28} /> : <Home size={28} />}
    </button>
  );
};

export default FloatingButton;