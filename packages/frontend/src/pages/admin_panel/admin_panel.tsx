import type React from 'react';
import { useEffect, useState } from 'react';
import './admin_panel.css';
import { CiLock, CiMail } from 'react-icons/ci';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    console.log('Login button clicked!');

    if (password === 'a') {
      setMessage({ text: 'Login failed.', type: 'error' });
    } else {
      setMessage({ text: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="admin-page-container">
      <div className="login-card">
        <h2 className="login-title">Admin Log In</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <CiMail className="input-icon" />
            <input
              type="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <CiLock className="input-icon" />
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="options-row">
            <label htmlFor="remember-me-checkbox" className="remember-me-label">
              {/* to pass the format check checkbox */}
              <input
                id="remember-me-checkbox"
                type="checkbox"
                className="hidden-checkbox"
                checked={rememberMe}
                onChange={handleCheckboxChange}
              />
              {rememberMe ? (
                <MdCheckBox className="checkbox-icon checked" />
              ) : (
                <MdCheckBoxOutlineBlank className="checkbox-icon unchecked" />
              )}
              <span>Remember Me</span>
            </label>
            <a href="forgot.com" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {message.text && (
          <div className={`message-box ${message.type}`}>{message.text}</div>
        )}
      </div>
    </div>
  );
}
