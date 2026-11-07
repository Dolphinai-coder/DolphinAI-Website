import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { search, snippet } from './search-index.js';

/*
  Site-wide search. A button in the navbar opens an overlay with a single
  input; results update as you type. Cmd/Ctrl+K opens it from anywhere,
  Esc closes, arrow keys move through results, Enter opens the highlighted one.
*/
export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const results = open ? search(q) : [];

  const close = useCallback(() => { setOpen(false); setQ(''); setActive(0); }, []);

  // Cmd/Ctrl+K from anywhere; Esc to close.
  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Focus the input and stop the page scrolling behind the overlay.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => { setActive(0); }, [q]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    const el = listRef.current?.children[active];
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function go(entry) {
    close();
    navigate(entry.path);
  }

  function onInputKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      <button
        type="button"
        className="site-search-bar"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
      >
        <Search size={17} className="site-search-bar-icon" />
        <span className="site-search-bar-text">Search…</span>
        <kbd className="site-search-kbd">⌘K</kbd>
      </button>

      {open && (
        <div className="site-search-overlay" onMouseDown={close} role="presentation">
          <div
            className="site-search-panel"
            onMouseDown={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
          >
            <div className="site-search-input-row">
              <Search size={18} className="site-search-input-icon" />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search pages and articles…"
                aria-label="Search query"
                autoComplete="off"
                spellCheck="false"
              />
              <button type="button" onClick={close} className="site-search-close" aria-label="Close search">
                <X size={17} />
              </button>
            </div>

            <div className="site-search-body">
              {q.trim().length < 2 ? (
                <p className="site-search-hint">
                  Type to search across every page and article — pricing, security, onboarding, the blog.
                </p>
              ) : results.length === 0 ? (
                <p className="site-search-hint">
                  No results for “{q.trim()}”. Try a different word, or{' '}
                  <button type="button" className="site-search-inline-link" onClick={() => go({ path: '/contact' })}>
                    contact us
                  </button>.
                </p>
              ) : (
                <ul className="site-search-results" ref={listRef}>
                  {results.map((r, i) => (
                    <li key={r.path}>
                      <button
                        type="button"
                        className={`site-search-result ${i === active ? 'active' : ''}`}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(r)}
                      >
                        <span className="site-search-result-top">
                          <span className="site-search-result-title">{r.title}</span>
                          <span className="site-search-result-section">{r.section}</span>
                        </span>
                        <span className="site-search-result-snippet">{snippet(r, q.trim().toLowerCase())}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="site-search-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd><CornerDownLeft size={11} /></kbd> open</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
