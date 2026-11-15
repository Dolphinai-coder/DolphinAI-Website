import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import { apiEndpoint } from './apiEndpoint.js';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ name: '', company: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.company || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(apiEndpoint('/api/auth/signup'), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          full_name: form.name,
          company:   form.company,
          email:     form.email,
          password:  form.password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
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

      <main className="login-main">
        <div className="login-card" style={{ maxWidth: '460px' }}>
          <div className="login-logo">
            <img src="/logowebsite.png" alt="Dolphin AI" style={{ height: '120px', width: 'auto', mixBlendMode: 'darken' }} />
          </div>

          {success ? (
            <div className="demo-success">
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#dcfce7"/>
                  <path d="M14 24l7 7 13-13" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Account created!</h2>
              <p>Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h1 className="login-title">Create your account</h1>
              <p className="login-sub">Start classifying your spend data with Dolphin AI</p>

              <form onSubmit={handleSubmit} noValidate className="login-form">
                <div className="signup-row">
                  <div className="login-field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" type="text" value={form.name} onChange={set('name')}
                      placeholder="Jane Smith" autoFocus />
                  </div>
                  <div className="login-field">
                    <label htmlFor="company">Company</label>
                    <input id="company" type="text" value={form.company} onChange={set('company')}
                      placeholder="Acme Corp" />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="email">Work email</label>
                  <input id="email" type="email" value={form.email} onChange={set('email')}
                    placeholder="you@company.com" autoComplete="email" />
                </div>

                <div className="login-field">
                  <label htmlFor="password">Password</label>
                  <div className="pass-wrap">
                    <input id="password" type={showPass ? 'text' : 'password'}
                      value={form.password} onChange={set('password')}
                      placeholder="Min. 8 characters" autoComplete="new-password" />
                    <button type="button" className="pass-toggle"
                      onClick={() => setShowPass(p => !p)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="confirm">Confirm password</label>
                  <input id="confirm" type={showPass ? 'text' : 'password'}
                    value={form.confirm} onChange={set('confirm')}
                    placeholder="Re-enter password" autoComplete="new-password" />
                </div>

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Creating account…' : <>Create account <ArrowRight size={16} /></>}
                </button>

                <p className="signup-terms">
                  By signing up you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                </p>
              </form>

              <div className="login-divider"><span>Already have an account?</span></div>
              <Link to="/login" className="btn btn-outline btn-full">Sign in</Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
