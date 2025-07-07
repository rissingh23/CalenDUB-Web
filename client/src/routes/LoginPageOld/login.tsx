import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
const logo = '/images/logo.png';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitted:', { username, password });
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logo} alt="CalenDub Logo" className="login-logo" />
        <h1>CALENDUB</h1>
      </header>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <Link to="/" className="back-button">
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
