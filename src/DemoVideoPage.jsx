import Navbar from './Navbar.jsx';
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';


export default function DemoVideoPage() {
  const navigate              = useNavigate();
  const videoRef              = useRef(null);
  const [ended, setEnded]     = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  function handlePlay() {
    setStarted(true);
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }

  function handleEnded() {
    setEnded(true);
    setProgress(100);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff 0%, var(--cream) 40%, var(--copper-bg) 100%)', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '640px' }}>
          <span style={{
            display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--copper)', background: 'var(--copper-pale)',
            padding: '4px 14px', borderRadius: '999px', marginBottom: '1rem'
          }}>
            Live Demo
          </span>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: 'var(--navy)', margin: '0 0 0.75rem' }}>
            See Dolphin AI in action
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', margin: 0 }}>
            Watch how we classify your spend data instantly — then try it yourself.
          </p>
        </div>

        {/* Video card */}
        <div style={{
          width: '100%', maxWidth: '860px',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 40px rgba(165,109,88,0.15), 0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid rgba(165,109,88,0.15)'
        }}>

          {/* Video */}
          <div style={{ position: 'relative', background: '#0F1928' }}>
            <video
              ref={videoRef}
              src="/demo.mp4"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              controls
              onPlay={handlePlay}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              poster="/demo-poster.png"
            />

            {/* Play overlay — shown before user starts */}
            {!started && (
              <div
                onClick={() => videoRef.current?.play()}
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(15,25,40,0.7) 0%, rgba(165,109,88,0.4) 100%)'
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #A56D58, #8B4E3A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(165,109,88,0.5)',
                  transition: 'transform 0.2s'
                }}>
                  <Play size={28} fill="#fff" color="#fff" style={{ marginLeft: 4 }} />
                </div>
                <p style={{ color: '#fff', marginTop: '1rem', fontWeight: 600, fontSize: '0.95rem', opacity: 0.9 }}>
                  Click to watch the demo
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--gray-100)' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #A56D58, #C4876E)',
              transition: 'width 0.3s ease'
            }} />
          </div>

        </div>

        {/* Button outside the video box */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/classify')}
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            Start classifying <ArrowRight size={17} />
          </button>
          <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.82rem' }}>
            Try the live classifier — no account needed.
          </p>
        </div>

      </main>
    </div>
  );
}
