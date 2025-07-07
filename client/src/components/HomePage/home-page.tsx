import React from "react";
import "./home-page.css";
const logo = '/images/logo.png';


const HomePage: React.FC = () => {
  // Button handlers
  const handleLogin = () => { 
    window.location.href = "/login"; // Replace with actual login URL
  };

  const handleViewCalendar = () => {
    alert("Redirecting to calendar...");
    window.location.href = "/calendar"; // Replace with actual calendar URL
  };

  return (
    <div className="home-page">
      <header className="header">
        <img src={logo} alt="CalenDub Logo" className="uw-logo" />
        <h1>CalenDub</h1>
      </header>
      <div className="content">
        <p>View events from RSOs and Athletics at the University of Washington.
           Login to post events or view calendar to browse upcoming activities.</p>
      </div>
      <div className="options">
        <button className="button" onClick={handleLogin}>
          Login
        </button>
        <button className="button" onClick={handleViewCalendar}>
          View Calendar
        </button>
      </div>
    </div>
  );
};

export default HomePage;
