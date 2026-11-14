// Search index for the site-wide search in the navbar.
//
// Static pages are listed here by hand; blog posts are pulled from
// blog-posts.json so new articles become searchable automatically when
// `npm run update-blog` regenerates it.

import posts from './blog-posts.json';

const PAGES = [
  { title: 'Home', path: '/', section: 'Page',
    text: 'Dolphin AI spend intelligence supplier normalization spend classification taxonomy ERP Excel savings supply chain dashboard' },
  { title: 'Solution', path: '/solution', section: 'Page',
    text: 'How Dolphin AI works end to end solution overview spend analytics for supply chain teams' },
  { title: 'Product', path: '/product', section: 'Page',
    text: 'Platform capabilities classification engine supplier normalization data quality integrations SAP Oracle Coupa Excel' },
  { title: 'Pricing', path: '/pricing', section: 'Page',
    text: 'Pricing plans subscription cost annual spend tiers how much does it cost ROI' },
  { title: 'Book a Demo', path: '/book-demo', section: 'Page',
    text: 'Book a demo schedule walkthrough talk to the team see it in action request' },
  { title: 'Free Estimate', path: '/assessment', section: 'Page',
    text: 'Free estimate ROI calculator savings potential assessment how much can we save' },
  { title: 'Live Classifier', path: '/classify', section: 'Page',
    text: 'Try the classifier demo classify a transaction supplier description category taxonomy AI' },
  { title: 'Demo Video', path: '/demo-video', section: 'Page',
    text: 'Demo video watch walkthrough recorded product tour' },
  { title: 'Dashboard', path: '/dashboard', section: 'Page',
    text: 'Dashboard spend by category spend by supplier monthly trend reporting visuals' },
  { title: 'Reporting', path: '/reporting', section: 'Page',
    text: 'Reporting dashboards analytics insights spend reports slicers export' },
  { title: 'Power BI', path: '/power-bi', section: 'Page',
    text: 'Power BI integration connector reports embedded analytics' },
  { title: 'Scoping', path: '/scoping', section: 'Page',
    text: 'Scoping data requirements what data do we need project scope fields' },
  { title: 'Onboarding', path: '/onboarding', section: 'Page',
    text: 'Onboarding implementation timeline getting started setup how long does it take' },
  { title: 'Security', path: '/security', section: 'Page',
    text: 'Security encryption Key Vault data protection compliance SOC 2 Type II certified certification attestation audit GDPR DPA NDA vendor security questionnaire access control hosting Azure' },
  { title: 'About', path: '/about', section: 'Page',
    text: 'About Dolphin AI company team mission who we are' },
  { title: 'Contact', path: '/contact', section: 'Page',
    text: 'Contact us get in touch email message support sales enquiry' },
  { title: 'Blog', path: '/blog', section: 'Page',
    text: 'Blog articles insights guides spend intelligence supply chain analytics' },
  { title: 'Privacy Policy', path: '/privacy', section: 'Legal',
    text: 'Privacy policy data protection GDPR personal data cookies' },
  { title: 'Terms', path: '/terms', section: 'Legal',
    text: 'Terms of service conditions legal agreement' },
  { title: 'Log in', path: '/login', section: 'Account', text: 'Log in sign in account access' },
  { title: 'Sign up', path: '/signup', section: 'Account', text: 'Sign up create account register' },
];

// Flatten a post's blocks into searchable text.
function postText(p) {
  const blocks = (p.content || []).map(b =>
    b.type === 'list' ? (b.items || []).join(' ') : (b.text || '')
  );
  return [p.excerpt, p.category, ...blocks].filter(Boolean).join(' ');
}

const POSTS = posts.map(p => ({
  title: p.title,
  path: `/blog/${p.slug}`,
  section: 'Blog',
  meta: p.readTime,
  text: postText(p),
}));

export const INDEX = [...PAGES, ...POSTS];

// Scores a single entry against the query. Returns 0 when it doesn't match.
// Title hits outrank body hits so "pricing" lands on the Pricing page rather
// than on an article that happens to mention the word.
function score(entry, q) {
  const title = entry.title.toLowerCase();
  const body = (entry.text || '').toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  let total = 0;

  for (const t of terms) {
    if (title === t) total += 100;
    else if (title.startsWith(t)) total += 60;
    else if (title.includes(t)) total += 40;
    else if (body.includes(t)) total += 10;
    else return 0;                       // every term must appear somewhere
  }
  if (entry.section === 'Page') total += 5;   // nudge pages above articles on ties
  return total;
}

// Pulls a short snippet of body text around the first match, for context.
export function snippet(entry, q) {
  const body = entry.text || '';
  const term = q.split(/\s+/).filter(Boolean)[0] || '';
  const i = body.toLowerCase().indexOf(term);
  if (i === -1) return body.slice(0, 110).trim() + (body.length > 110 ? '…' : '');
  const start = Math.max(0, i - 45);
  const end = Math.min(body.length, i + 85);
  return (start > 0 ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '');
}

export function search(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return INDEX
    .map(e => ({ entry: e, s: score(e, q) }))
    .filter(r => r.s > 0)
    .sort((a, b) => b.s - a.s || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map(r => r.entry);
}
