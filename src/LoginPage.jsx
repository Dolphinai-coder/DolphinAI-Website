import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import { apiEndpoint } from './apiEndpoint.js';

export default function LoginPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(apiEndpoint('/api/auth/login'), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        localStorage.setItem('dolphin_user', JSON.stringify(data.user));
        navigate(redirectTo);
      }
    } catch {
      setError('This service is currently unavailable. Please try again later.');
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="logo-link">
            <img src="/logowebsite.png" alt="Dolphin AI" className="logo-img" />
          </Link>
          <nav className="nav-links">
            <Link to="/#solution">Solution</Link>
            <Link to="/#workflow">Workflow</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/#contact">Contact</Link>
          </nav>
          <div className="nav-actions">
            <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
          </div>
        </div>
      </header>

      {/* Login card */}
      <main className="login-main">
        <div className="login-card">
          <div className="login-logo">
            <img src="/logowebsite.png" alt="Dolphin AI" style={{ height: '120px', width: 'auto', mixBlendMode: 'darken' }} />
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to your Dolphin AI workspace</p>

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className="login-field">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">Password</label>
                <span className="forgot-link" style={{ cursor: 'default', opacity: 0.45 }}>Forgot password?</span>
              </div>
              <div className="pass-wrap">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="login-divider"><span>New to Dolphin AI?</span></div>

          <Link to="/signup" className="btn btn-outline btn-full">
            Create an account
          </Link>
        </div>
      </main>
    </div>
  );
}
