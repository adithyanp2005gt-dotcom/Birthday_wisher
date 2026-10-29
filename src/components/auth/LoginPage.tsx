import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flower2, Eye, EyeOff, Lock, User, Sparkles, AlertCircle } from 'lucide-react';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const VALID_USERNAME = 'Adhi@162006';
const VALID_PASSWORD = 'Adhi@162006';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulate a brief auth delay for UX polish
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        try {
          sessionStorage.setItem('amma_auth_session', 'true');
        } catch {
          // Ignored
        }
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Incorrect username or password. Please try again.');
        triggerShake();
        setPassword('');
      }
    }, 800);
  };

  return (
    <div className="login-backdrop">
      {/* Ambient petal particles */}
      <div className="login-petals" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`login-petal login-petal-${i + 1}`} />
        ))}
      </div>

      <motion.div
        className={`login-card ${shake ? 'login-card-shake' : ''}`}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo / Branding */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <Flower2 size={28} color="#d4af37" />
          </div>
          <div className="login-brand-badge">
            <Sparkles size={11} />
            <span>Rose Garden Studio</span>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to create &amp; personalise your surprise experiences.</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="login-field">
            <label htmlFor="login-username" className="login-label">
              Username
            </label>
            <div className="login-input-wrap">
              <User size={15} className="login-input-icon" />
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                className="login-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              Password
            </label>
            <div className="login-input-wrap">
              <Lock size={15} className="login-input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="login-input login-input-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner" aria-label="Signing in…" />
            ) : (
              <>
                <Flower2 size={15} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <p className="login-footer-note">
          🔒 Your customisations are private and stay on your device.
        </p>
      </motion.div>
    </div>
  );
};

