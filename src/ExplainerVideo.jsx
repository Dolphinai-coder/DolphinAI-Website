import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';

/*
  The 2-minute explainer on the homepage.

  The 15 MB file is never fetched until someone asks for it: until then the
  section shows a poster frame (43 KB webp) and the <video> element does not
  exist. When the video ends we cover it with the two next steps instead of
  leaving a black frame.
*/
export default function ExplainerVideo() {
  const [started, setStarted] = useState(false);
  const [ended, setEnded]     = useState(false);
  const videoRef = useRef(null);

  // Safari does not always honour the autoPlay attribute on an element that
  // was just mounted, so start it ourselves — still inside the click's user
  // gesture. If the browser refuses, the native controls are already there.
  useEffect(() => {
    if (!started) return;
    videoRef.current?.play().catch(() => {});
  }, [started]);

  function replay() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
  }

  return (
    <section className="vid-section" id="watch">
      <div className="container vid-inner">

        <motion.div
          className="section-head centered"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">Watch · 2 min</span>
          <h2>See what Dolphin AI actually does</h2>
          <div className="section-rule" />
          <p className="vid-sub">
            From a dozen messy exports to one clean, classified view of your spend —
            the whole idea in two minutes.
          </p>
        </motion.div>

        <motion.div
          className="vid-stage"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <div className="vid-frame">
            {!started ? (
              <button
                type="button"
                className="vid-poster"
                onClick={() => setStarted(true)}
                aria-label="Play the Dolphin AI overview video, 2 minutes"
              >
                <picture>
                  <source srcSet="/explainer-poster.webp" type="image/webp" />
                  <img
                    src="/explainer-poster.jpg"
                    alt="Dolphin AI overview — your spend data lives in a dozen places"
                    width="1600" height="900" loading="lazy" decoding="async"
                  />
                </picture>
                <span className="vid-scrim" />
                <span className="vid-play"><Play size={30} fill="currentColor" /></span>
                <span className="vid-cta-text">Watch the 2-minute overview</span>
              </button>
            ) : (
              <video
                ref={videoRef}
                src="/explainer.mp4"
                poster="/explainer-poster.jpg"
                controls autoPlay playsInline preload="auto"
                onPlay={() => setEnded(false)}
                onEnded={() => setEnded(true)}
              />
            )}

          </div>

          {/* The video ends on its own call-to-action frame, so the next steps
              appear under it rather than covering it. */}
          {ended && (
            <motion.div
              className="vid-after"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="vid-after-text">Ready to see it on your own data?</span>
              <Link to="/book-demo" className="btn btn-primary">
                Book a demo <ArrowRight size={15} />
              </Link>
              <Link to="/classify" className="btn btn-soft-estimate">
                Try the live classifier
              </Link>
              <button type="button" className="vid-replay" onClick={replay}>Replay</button>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
