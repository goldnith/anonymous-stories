import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Loader from './components/Loader';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitStory from "./pages/SubmitStory";
import Alien from "./components/Alien";

function AppContent() {
  const { isLoading, setIsLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading]);

  return (
    <>
      <Navbar />
      <Alien />
      {isLoading && <Loader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitStory />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <Router>
        <AppContent />
      </Router>
    </LoadingProvider>
  );
}

export default App;