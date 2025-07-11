import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, ExplorePage, LoginPage, SignupPage } from 'routes';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from 'react';
import { keepAlive } from './utils/keepAlive';

const App = () => {
  // Start keep-alive pings when app loads
  useEffect(() => {
    keepAlive.start();
    
    // Cleanup on unmount
    return () => {
      keepAlive.stop();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
