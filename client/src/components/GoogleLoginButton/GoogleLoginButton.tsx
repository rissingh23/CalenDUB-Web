import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase.ts";
import { makeAuthenticatedRequest, API_ENDPOINTS } from '../../utils/api';
import googleLogo from 'assets/google-logo.png';
import uwLogo from 'assets/uw-logo.webp';
import './GoogleLoginButton.css';

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google login successful:', user);

      // Register/authenticate user with backend using proper Authorization header
      const response = await makeAuthenticatedRequest(API_ENDPOINTS.USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uid: user.uid, 
          email: user.email,
          name: user.displayName 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      console.log('Success - user logged in:', data);
      navigate('/explore');

    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  return (
    <button className='google-uw-button' onClick={handleLogin}>
      <img src={googleLogo} alt="Google" className='google-icon' />
      <div className='google-uw-button-text'>Continue with Google/UW Net ID</div>
      <img src={uwLogo} alt="UW" className='uw-icon' />
    </button>
  );
};

export default GoogleLoginButton;
