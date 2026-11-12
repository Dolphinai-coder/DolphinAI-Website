import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SiteSearch from './SiteSearch.jsx';
import ExplainerVideo from './ExplainerVideo.jsx';
import PricingPage from './PricingPage.jsx';
import ClassifyPage from './ClassifyPage.jsx';
import PrivacyPage from './PrivacyPage.jsx';
import TermsPage from './TermsPage.jsx';
import AboutPage from './AboutPage.jsx';
import SecurityPage from './SecurityPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import BookDemoPage from './BookDemoPage.jsx';
import DemoVideoPage from './DemoVideoPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import ContactPage from './ContactPage.jsx';
import AssessmentPage from './AssessmentPage.jsx';
import ProductPage from './ProductPage.jsx';
import ReportingPage from './ReportingPage.jsx';
import ScopingPage from './ScopingPage.jsx';
import OnboardingPage from './OnboardingPage.jsx';
import SolutionPage from './SolutionPage.jsx';
import PowerBIPage from './PowerBIPage.jsx';
import BlogPage from './BlogPage.jsx';
import BlogPostPage from './BlogPostPage.jsx';
import CookieBanner from './CookieBanner.jsx';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Layers3,
  RefreshCcw,
  Search,
  ShieldCheck,
  TrendingUp,
  Building2,
  Lightbulb,
  Link2,
  Database,
  ClipboardList,
  BookOpen,
} from 'lucide-react';

const features = [
  {
    icon: <Layers3 size={22} />,
    title: 'Spend taxonomy classification',
    text: 'Automatically classify transaction lines into category, subcategory, family, and spend group using your organization taxonomy.'
  },
  {
    icon: <RefreshCcw size={22} />,
    title: 'Supplier name normalization',
    text: 'Group duplicate supplier names, clean spelling variations, and create one trusted supplier identity across your data.'
  },
  {
    icon: <Search size={22} />,
    title: 'Data quality detection',
    text: 'Identify inconsistent descriptions, missing fields, duplicates, and unreliable labels before analysis.'
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Actionable spend visibility',
    text: 'Turn messy ERP and Excel exports into clean reporting-ready data for organization and finance teams.'
  }
];

const steps = [
  { num: '01', title: 'Import',    text: 'Import raw spend data from Excel, ERP, or any organization system.' },
  { num: '02', title: 'Normalize', text: 'Normalize supplier names and detect duplicates automatically.' },
  { num: '03', title: 'Classify',  text: 'Classify spend using your taxonomy, business rules, and AI suggestions.' },
  { num: '04', title: 'Clear Visibility', text: 'Explore your clean spend data through interactive dashboards and slicers — no exports needed.' }
];

const FAQ_GROUPS = ['Overview', 'Data & Classification', 'Value & Savings', 'Rollout & Trust'];

const FAQS = [
  {
    group: 'Overview',
    q: 'What is Dolphin AI, and what does it actually do?',
    a: ["Dolphin AI turns messy spend data into a clean, classified view of what you buy, where the money goes, and which suppliers/vendors you rely on. We can pull data from any source, including ERP systems, spreadsheets, supply chain platforms, AP and invoice systems, and other databases. Our solution then cleans and standardizes supplier/vendor names and descriptions and categorizes every line of spend.",
         "With that clarity, your team can negotiate better contracts, bring tail spend under control, consolidate suppliers/vendors, and cut the hours spent on manual data work."],
  },
  {
    group: 'Data & Classification',
    q: 'What kind of data do we need to provide, and can Dolphin AI work with messy or incomplete data?',
    a: ["Dolphin AI primarily works with supplier/vendor and spend-related data, such as supplier/vendor names, product or service descriptions, transaction details, categories, quantities, and spend amounts.",
         "Business data often contains inconsistent supplier/vendor names, formatting differences, or missing information. Dolphin AI cleans, normalizes and structures the available data before analysis to create a more consistent and usable dataset."],
  },
  {
    group: 'Data & Classification',
    q: 'How does Dolphin AI classify spend?',
    a: ["Dolphin AI matches each transaction's description to the available taxonomy and assigns it to a category across four levels. When a description isn't available, our AI looks at what the supplier/vendor does and classifies based on that business activity.",
         "If a supplier covers several categories, the spend is marked as unclassified and left for your review. Once you provide a description, it can be classified. Every classification comes with its reasoning, even for tail spend, so you can see exactly why it was assigned."],
  },
  {
    group: 'Value & Savings',
    q: 'How can Dolphin AI help us reduce costs and negotiate better with suppliers/vendors?',
    a: ["By creating a clearer view of supplier/vendor relationships and historical spending, Dolphin AI can help businesses identify areas that deserve further investigation, such as fragmented spending, high-spend categories, supplier/vendor consolidation opportunities, or potential sourcing improvements.",
         "This gives decision-makers a stronger fact base when negotiating pricing, volumes, commercial terms, or future agreements with suppliers/vendors."],
  },
  {
    group: 'Value & Savings',
    q: 'What benefits does Dolphin AI deliver?',
    a: ['Dolphin AI turns spend data from something your team has to wrestle with into something you can act on. The major areas of value are:'],
    bullets: [
      { label: 'Data you can trust', text: 'clean, consistent, classified spend data, with the reasoning behind every classification, so decisions rest on facts instead of guesswork.' },
      { label: 'Stronger negotiations', text: 'see exactly what you buy and from whom, and walk into supplier/vendor conversations with the evidence to ask for better terms.' },
      { label: 'Tail spend under control', text: 'the small, scattered purchases that usually slip through the cracks finally get visibility and management.' },
      { label: 'Smarter supplier/vendor consolidation', text: 'spot where many suppliers/vendors serve the same need and build leverage with fewer, stronger relationships.' },
    ],
  },
  {
    group: 'Value & Savings',
    q: 'How much labor cost and how many hours can Dolphin AI save our team?',
    a: ["Think about how much of your team's week disappears into exporting spend data, cleaning it, matching supplier/vendor names and re-categorizing everything in spreadsheets. That's skilled people doing repetitive work, and it's expensive.",
         "Dolphin AI takes that work over, so you save labor hours and labor cost: you need fewer people, or far fewer hours, on manual data work, and your team can spend their time on sourcing, negotiation and decisions instead. Our ROI calculator shows what that's worth for your own team size, hourly rate and weekly hours."],
  },
  {
    group: 'Data & Classification',
    q: 'Can Dolphin AI work with our existing categories and business structure?',
    a: ["The objective is to organize data in a way that is meaningful for the business. If an organization already has established categories or a taxonomy, this can be considered when structuring its spend data. The exact taxonomy setup and customization requirements would be agreed upon as part of implementation."],
  },
  {
    group: 'Rollout & Trust',
    q: 'How do we see and use the results?',
    a: ["Dolphin AI delivers your data in dashboard form, with standard visualizations that cover the requirements most teams have for running the business and making decisions. Your organization stays in control of who has access to the dashboards."],
  },
  {
    group: 'Rollout & Trust',
    q: 'How long does it take to implement Dolphin AI?',
    a: ["Implementation is designed to be quick and streamlined. The timeline depends on data volume, complexity, and integration requirements, but Dolphin AI can rapidly process and analyze your spend data so your team can begin identifying opportunities without a lengthy implementation process."],
  },
  {
    group: 'Rollout & Trust',
    q: 'How secure is our data with Dolphin AI?',
    a: ["We take the security of our clients' data seriously. Dolphin AI is built and hosted in a certified, enterprise-grade cloud environment that follows leading industry security and compliance standards, and your data is never shared with third parties.",
         "For enterprise implementations, we work with your technical team to align with your organization's security policies."],
  },
  {
    group: 'Rollout & Trust',
    q: 'How much does Dolphin AI cost?',
    a: ["Dolphin AI offers subscription plans based on the size of your annual spend, so the plan fits your organization. Our ROI calculator gives you an estimate of the value for your own numbers and a recommended plan for your spend.",
         "For specifics, book a demo or request a free estimate and we will walk you through the options."],
  },
  {
    group: 'Overview',
    q: "Can't we just use a general AI tool and a prompt to do this?",
    a: ["AI is changing how businesses work, but a single prompt cannot produce a complete, reliable solution for a specific business problem. Spend analysis needs data connected and synced across one or many systems, classification you can trust with clear reasoning, and secure handling of your supplier/vendor and spend data.",
         "Dolphin AI is purpose-built for this, combining AI models with the data pipelines, security and dashboards that turn raw spend data into a reliable, repeatable solution."],
  },
];

function FaqSection() {
  const [group, setGroup] = useState('All');
  const [open, setOpen]   = useState(0);

  const visible = group === 'All' ? FAQS : FAQS.filter(f => f.group === group);

  function pick(g) {
    setGroup(g);
    setOpen(0);
  }

  return (
    <section className="faq-section" id="faq">
      <div className="container faq-grid">

        <aside className="faq-rail">
          <span className="eyebrow">FAQ</span>
          <h2 className="faq-title">Answers Before You Ask</h2>
          <p className="faq-sub">
            The questions teams raise most often when they evaluate Dolphin AI — on data, classification,
            savings, security, and what rollout actually looks like.
          </p>

          <div className="faq-cta">
            <p className="faq-cta-title">Still have a question?</p>
            <p className="faq-cta-text">Talk to someone who works with spend data every day.</p>
            <Link to="/book-demo" className="btn btn-primary faq-cta-btn">
              Book a Demo <ArrowRight size={14} />
            </Link>
            <Link to="/contact" className="faq-cta-link">Or send us a message <ArrowRight size={13} /></Link>
          </div>
        </aside>

        <div className="faq-main">
          <div className="faq-filters" role="tablist" aria-label="FAQ categories">
            {['All', ...FAQ_GROUPS].map(g => (
              <button
                key={g}
                role="tab"
                aria-selected={group === g}
                className={`faq-pill ${group === g ? 'active' : ''}`}
                onClick={() => pick(g)}
              >
                {g}
                <span className="faq-pill-count">
                  {g === 'All' ? FAQS.length : FAQS.filter(f => f.group === g).length}
                </span>
              </button>
            ))}
          </div>

          <div className="faq-list">
            {visible.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className={`faq-item ${isOpen ? 'open' : ''}`} key={item.q}>
                  <button
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="faq-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq-q-text">{item.q}</span>
                    <span className="faq-toggle" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="15" height="15">
                        <line x1="2.5" y1="8" x2="13.5" y2="8" />
                        <line x1="8" y1="2.5" x2="8" y2="13.5" className="faq-toggle-v" />
                      </svg>
                    </span>
                  </button>

                  <div className="faq-ans-wrap" id={`faq-panel-${i}`} role="region">
                    <div className="faq-ans-inner">
                      <div className="faq-a">
                        {item.a.map(p => <p key={p}>{p}</p>)}
                        {item.bullets && (
                          <ul className="faq-bullets">
                            {item.bullets.map(b => (
                              <li key={b.label}>
                                <strong>{b.label}:</strong> {b.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── Brand SVG logos ─────────────────────────────────────── */

function LogoSAP() {
  return (
    <svg width="60" height="38" viewBox="0 0 60 38" fill="none">
      <rect width="60" height="38" rx="6" fill="#009999"/>
      <polygon points="0,0 46,0 60,38 14,38" fill="rgba(0,0,0,0.18)"/>
      <text x="30" y="26" textAnchor="middle" fill="white"
        fontSize="16" fontWeight="900" fontFamily="'Arial Black',Arial,sans-serif" letterSpacing="2">SAP</text>
    </svg>
  );
}

function LogoDynamics() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <rect width="38" height="38" rx="8" fill="#EDEBF0"/>
      <path d="M9 7h11c7 0 11 4.2 11 10.5S27 28 20 28h-5v-6h5c3.2 0 5-1.8 5-4.5S20.2 13 17 13h-2v16H9V7z" fill="#5C2D91"/>
    </svg>
  );
}

function LogoExcel() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="14" fill="#185C37"/>
      <path d="M10 10h16v36H10z" fill="#21A366"/>
      <path d="M16 20l5 8-5 8h4l3-5 3 5h4l-5-8 5-8h-4l-3 5-3-5z" fill="white"/>
      <rect x="26" y="18" width="18" height="4" rx="1.5" fill="white" opacity="0.85"/>
      <rect x="26" y="26" width="18" height="4" rx="1.5" fill="white" opacity="0.85"/>
      <rect x="26" y="34" width="18" height="4" rx="1.5" fill="white" opacity="0.85"/>
    </svg>
  );
}

function LogoSharePoint() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="14" fill="#F3F2F1"/>
      <circle cx="22" cy="29" r="11" fill="#036C70"/>
      <circle cx="32" cy="23" r="9"  fill="#1A9BA1"/>
      <circle cx="36" cy="33" r="8"  fill="#37C6D0"/>
      <text x="22" y="34" textAnchor="middle" fill="white"
        fontSize="13" fontWeight="900" fontFamily="Arial,sans-serif">S</text>
    </svg>
  );
}

function LogoCoupa() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <rect width="38" height="38" rx="8" fill="#00B2A9"/>
      <path d="M26 19c0 3.9-3.1 7-7 7s-7-3.1-7-7 3.1-7 7-7c2.1 0 4 .9 5.3 2.4l-2.8 2.8C22.8 16.4 21.5 16 20 16c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3h-3v-3h6v3z" fill="white"/>
    </svg>
  );
}


function LogoOracle() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="14" fill="#F8F8F8"/>
      <rect x="8" y="18" width="40" height="20" rx="10" fill="#E10000"/>
      <rect x="18" y="18" width="20" height="20" rx="0" fill="#F8F8F8"/>
      <text x="28" y="33" textAnchor="middle" fill="#E10000"
        fontSize="8" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="0.5">ORACLE</text>
    </svg>
  );
}


function LogoWorkday() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#F3F2F1"/>
      {/* Workday rising-sun motif: three concentric arcs */}
      <path d="M8 27 A12 10 0 0 1 32 27" stroke="#E8930C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M12 27 A8  7  0 0 1 28 27" stroke="#E8930C" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.65"/>
      <path d="M16 27 A4  3.5 0 0 1 24 27" stroke="#E8930C" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.35"/>
    </svg>
  );
}

function LogoAriba() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#F5F5F5"/>
      <text x="26" y="31" textAnchor="middle" fill="#0070D2"
        fontSize="11" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="0.5">ARIBA</text>
      <rect x="10" y="34" width="32" height="2.5" rx="1.25" fill="#0070D2" opacity="0.6"/>
    </svg>
  );
}

function LogoJaggaer() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#F0F7F0"/>
      <text x="26" y="31" textAnchor="middle" fill="#2E7D32"
        fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="0.3">JAGGAER</text>
      <circle cx="26" cy="17" r="6" fill="#2E7D32" opacity="0.2"/>
      <circle cx="26" cy="17" r="3" fill="#2E7D32"/>
    </svg>
  );
}

const TICKER_ITEMS = [
  { logo: <LogoSAP />,      name: 'SAP' },
  { logo: <LogoOracle />,   name: 'Oracle' },
  { logo: <LogoDynamics />, name: 'MS Dynamics' },
  { logo: <LogoCoupa />,    name: 'Coupa' },
  { logo: <LogoExcel />,    name: 'Excel' },
  { logo: <LogoSharePoint />, name: 'SharePoint' },
  { logo: <LogoWorkday />,  name: 'Workday' },
  { logo: <LogoAriba />,    name: 'SAP Ariba' },
  { logo: <LogoJaggaer />,  name: 'Jaggaer' },
];

function LogoTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-section">
      <p className="ticker-label">Works with the tools your team already uses</p>
      <div className="ticker-wrap">
        <div className="ticker-track">
          {items.map((item, i) => (
            <div className="ticker-item" key={i}>
              {item.logo}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoAzure() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#F0F4FF"/>
      <path d="M15 38 L24 16 H30 L22 32 H30 L32 38 Z" fill="url(#azgrad)"/>
      <path d="M24 16 L29 28 L25 34 L19 22 Z" fill="#50E6FF" opacity="0.55"/>
      <defs>
        <linearGradient id="azgrad" x1="15" y1="16" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0078D4"/>
          <stop offset="100%" stopColor="#50E6FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────── */

const AFTER_ITEMS = [
  {
    label: 'One normalized supplier master view',
    preview: (
      <div className="ap-preview-supplier">
        <div className="ap-preview-title">Supplier normalization</div>
        {[
          { raw: '3M Corp',         norm: '3M Company' },
          { raw: 'Three M Ltd',     norm: '3M Company' },
          { raw: 'Oracle Inc',      norm: 'Oracle Corporation' },
          { raw: 'ORACLE CORP',     norm: 'Oracle Corporation' },
          { raw: 'SAP AG',          norm: 'SAP SE' },
        ].map(r => (
          <div className="ap-row" key={r.raw}>
            <span className="ap-raw">{r.raw}</span>
            <span className="ap-arrow">→</span>
            <span className="ap-norm"><CheckCircle2 size={12}/>{r.norm}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Spend mapped to a consistent taxonomy',
    preview: (
      <div className="ap-preview-taxonomy">
        <div className="ap-preview-title">Taxonomy mapping</div>
        {[
          { cat: 'IT Software',   sub: 'SaaS Tools',        pct: 34 },
          { cat: 'Logistics',     sub: 'Freight & Shipping', pct: 22 },
          { cat: 'MRO',           sub: 'Industrial Supplies',pct: 18 },
          { cat: 'Professional',  sub: 'Consulting',         pct: 14 },
          { cat: 'Facilities',    sub: 'Utilities',          pct: 12 },
        ].map(r => (
          <div className="ap-tax-row" key={r.cat}>
            <div className="ap-tax-labels">
              <span className="ap-tax-cat">{r.cat}</span>
              <span className="ap-tax-sub">{r.sub}</span>
            </div>
            <div className="ap-tax-bar-wrap">
              <div className="ap-tax-bar" style={{ width: `${r.pct * 2.5}%` }} />
            </div>
            <span className="ap-tax-pct">{r.pct}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Clear category visibility for organization strategy',
    preview: (
      <div className="ap-preview-visibility">
        <div className="ap-preview-title">Category spend breakdown</div>
        <div className="ap-vis-bars">
          {[
            { label: 'IT Software',  val: 34, color: '#E06820' },
            { label: 'Logistics',    val: 22, color: '#C4591A' },
            { label: 'MRO',          val: 18, color: '#F0A070' },
            { label: 'Professional', val: 14, color: '#1B2A4A' },
            { label: 'Facilities',   val: 12, color: '#8394A8' },
          ].map(b => (
            <div className="ap-vis-bar-row" key={b.label}>
              <span className="ap-vis-label">{b.label}</span>
              <div className="ap-vis-track">
                <div className="ap-vis-fill" style={{ width: `${b.val * 2.5}%`, background: b.color }} />
              </div>
              <span className="ap-vis-val">{b.val}%</span>
            </div>
          ))}
        </div>
        <div className="ap-vis-stat">
          <span>97% classified</span><span>↑ from 54% before</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Clean exports for BI, dashboards, and reporting',
    preview: (
      <div className="ap-preview-export">
        <div className="ap-preview-title">Export-ready data</div>
        <table className="ap-table">
          <thead>
            <tr><th>Supplier</th><th>Category</th><th>Amount</th><th></th></tr>
          </thead>
          <tbody>
            {[
              { s: 'SAP SE',          c: 'IT Software',  a: '$2.4M' },
              { s: 'Oracle Corp',     c: 'IT Software',  a: '$1.8M' },
              { s: 'DHL Express',     c: 'Logistics',    a: '$940K' },
              { s: 'Fastenal Co.',    c: 'MRO',          a: '$620K' },
              { s: 'Deloitte',        c: 'Professional', a: '$510K' },
            ].map(r => (
              <tr key={r.s}>
                <td>{r.s}</td><td>{r.c}</td><td>{r.a}</td>
                <td><CheckCircle2 size={12} color="#16a34a"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
];

function AfterPreviewSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="compare-section container">
      <div className="section-head centered">
        <span className="eyebrow">The difference</span>
        <h2>Before and after Dolphin AI.</h2>
        <div className="section-rule" />
      </div>
      <div className="compare-grid compare-grid-3">
        {/* Before */}
        <div className="compare-card compare-before">
          <div className="compare-head"><FileSpreadsheet size={24}/><h3>Before</h3></div>
          {[
            'Supplier duplicates across several systems',
            'Manual spend category mapping in Excel',
            'Low confidence in category-level reporting',
            'Slow analysis before organization decisions',
          ].map(item => (
            <div className="compare-item" key={item}><span className="dot"/>{item}</div>
          ))}
        </div>
        {/* After */}
        <div className="compare-card compare-after">
          <div className="compare-head"><ShieldCheck size={24}/><h3>After Dolphin AI</h3></div>
          {AFTER_ITEMS.map((item, i) => (
            <button
              key={item.label}
              className={`compare-item compare-item-btn${active === i ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <CheckCircle2 size={16}/>
              <span>{item.label}</span>
              <ArrowRight size={13} className="ap-chevron"/>
            </button>
          ))}
          <p className="ap-hint">Select an item to see an example →</p>
        </div>
        {/* Preview */}
        <div className="compare-card ap-preview-card">
          {AFTER_ITEMS[active].preview}
        </div>
      </div>
    </section>
  );
}


function HomePage() {
  const [productOpen, setProductOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const productRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!productRef.current) return;
      if (!productRef.current.contains(e.target)) {
        setProductOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setProductOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="site">

      {/* ── Navbar ── */}
      <header className="navbar">
        <div className="container nav-inner">
          <a href="/" className="logo-link">
            <img src="/logowebsite.png" alt="Dolphin AI" className="logo-img" />
          </a>
          <nav className="nav-links">
            {/* Product mega menu */}
            <div
              ref={productRef}
              className="nav-item product-item"
              onMouseEnter={() => { clearTimeout(closeTimer.current); setProductOpen(true); }}
              onMouseLeave={() => { closeTimer.current = setTimeout(() => setProductOpen(false), 180); }}
            >
              <button
                className={`nav-link product-toggle ${productOpen ? 'open' : ''}`}
                aria-haspopup="true"
                aria-expanded={productOpen}
                onClick={(e) => { e.stopPropagation(); setProductOpen(p => !p); }}
                onKeyDown={(e) => { if (e.key === 'Escape') setProductOpen(false); }}
              >
                <span>Product</span>
                <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true" focusable="false">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" fill="currentColor" />
                </svg>
              </button>

              <div className={`mega-menu ${productOpen ? 'open' : ''}`} role="menu">
                <div className="mega-inner container">

                  {/* Left: Overview */}
                  <div className="mega-overview">
                    <div className="mega-brand-badge">
                      <img src="/logowebsite.png" alt="Dolphin AI" style={{ height: 44, objectFit: 'contain', mixBlendMode: 'darken' }} />
                    </div>
                    <h4 className="mega-overview-title">Spend Intelligence Platform</h4>
                    <p className="mega-overview-copy">Clean, classify, and analyze your organization data from any source — in hours, not months.</p>
                    <a href="/product" className="mega-overview-link" onClick={() => setProductOpen(false)}>Explore platform <ArrowRight size={13} /></a>
                  </div>

                  {/* Center: Capabilities grid */}
                  <div className="mega-caps">
                    <p className="mega-section">Capabilities</p>
                    <div className="mega-caps-grid">
                      {[
                        { icon: <Layers3 size={16}/>,    title: 'Spend Classification',   desc: 'Map every transaction to your taxonomy', href: '/product#spend-classification' },
                        { icon: <Building2 size={16}/>,  title: 'Supplier Normalization', desc: 'One trusted view of every supplier',      href: '/product#supplier-normalization' },
                        { icon: <TrendingUp size={16}/>, title: 'Spend Intelligence',     desc: 'Trends, KPIs, and category visibility',   href: '/product#spend-intelligence' },
                        { icon: <Lightbulb size={16}/>,  title: 'Opportunity Detection',  desc: 'Savings, tail spend, off-contract',       href: '/product#opportunity-detection' },
                        { icon: <Database size={16}/>,   title: 'Data Enrichment',        desc: 'AI-assisted cleaning and enrichment',     href: '/product#data-enrichment' },
                        { icon: <Link2 size={16}/>,      title: 'Integrations',           desc: 'SAP, Oracle, Coupa, Excel and more',      href: '/product#integrations' },
                      ].map(item => (
                        <a href={item.href} className="mega-cap-item" key={item.title} onClick={() => setProductOpen(false)}>
                          <div className="mega-cap-icon">{item.icon}</div>
                          <div className="mega-cap-text">
                            <strong>{item.title}</strong>
                            <span>{item.desc}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mega-resources">
                    <Link to="/demo-video" className="mega-demo-cta" onClick={() => setProductOpen(false)}>
                      See Dolphin AI in action <ArrowRight size={13}/>
                    </Link>
                    <Link to="/dashboard" className="mega-resource-link" onClick={() => setProductOpen(false)}>
                      <BarChart3 size={14}/> Sample Dashboard
                    </Link>
                    <Link to="/reporting" className="mega-resource-link" onClick={() => setProductOpen(false)}>
                      <TrendingUp size={14}/> Reporting
                    </Link>
                    <Link to="/scoping" className="mega-resource-link" onClick={() => setProductOpen(false)}>
                      <ClipboardList size={14}/> Project Scoping Tool
                    </Link>
                    <Link to="/onboarding" className="mega-resource-link" onClick={() => setProductOpen(false)}>
                      <BookOpen size={14}/> How It Works
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* nav links */}
            <Link to="/solution">Solution</Link>
            <a href="#workflow">Workflow</a>
            <Link to="/pricing">Pricing</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div className="nav-actions">
            <SiteSearch />
            <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
            <Link to="/assessment" className="btn btn-soft-estimate">Get a free estimate <ArrowRight size={14} /></Link>
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(m => !m)} aria-label="Menu">
            <span className={`hamburger ${mobileOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>
      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="mobile-nav" onClick={() => setMobileOpen(false)}>
          <Link to="/solution">Solution</Link>
          <a href="#workflow">Workflow</a>
          <Link to="/pricing">Pricing</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
        </div>
      )}

      <main>

        {/* ══ HERO ══ */}
        <section className="hero">
          <div className="container">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <h1 className="hero-title">Transform raw spend data into actionable intelligence</h1>
              <p className="hero-subtitle">
                Dolphin AI normalizes supplier names, classifies spend using your taxonomy,
                and reveals opportunities hidden in organization data.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══ LOGO TICKER ══ */}
        <LogoTicker />

        {/* ══ EXPLAINER VIDEO ══ */}
        <ExplainerVideo />

        {/* ══ BEFORE / AFTER ══ */}
        <AfterPreviewSection />

        {/* ══ INTEGRATIONS + SOLUTION (unified) ══ */}
        <section id="ecosystem" className="intsol-section">

          {/* ── Header ── */}
          <div className="container">
            <motion.div
              className="intsol-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow">Integrations & Solution</span>
              <h2>From raw data sources to <span className="intsol-accent">clean strategic insight</span></h2>
              <p>Connect every spend source, normalize supplier data, and classify spend using your taxonomy — all in one intelligent layer.</p>
            </motion.div>
          </div>

          {/* ── Two-column body ── */}
          <div className="container intsol-body">

            {/* LEFT: 3×3 CSS grid hub */}
            <motion.div
              className="intsol-hub-col"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="intsol-band-label" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
                <span>Connect your existing systems</span>
                <span className="intsol-band-line" style={{ maxWidth: 80 }} />
              </div>
              <div className="hub-matrix">
                {/* SVG connector lines */}
                <svg className="hub-matrix-svg" viewBox="0 0 3 3" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="0.5" y1="0.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  <line x1="1.5" y1="0.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  <line x1="2.5" y1="0.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  <line x1="0.5" y1="1.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  <line x1="2.5" y1="1.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  <line x1="0.5" y1="2.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  <line x1="1.5" y1="2.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  <line x1="2.5" y1="2.5" x2="1.5" y2="1.5" stroke="#A56D58" strokeWidth="0.04" strokeOpacity="0.25"/>
                  {/* Animated data dots */}
                  <circle r="0.055" fill="#A56D58" opacity="0.8"><animateMotion dur="2.4s" repeatCount="indefinite" path="M0.5,0.5 L1.5,1.5"/></circle>
                  <circle r="0.055" fill="#1B2A4A" opacity="0.7"><animateMotion dur="2.8s" repeatCount="indefinite" begin="0.4s" path="M1.5,0.5 L1.5,1.5"/></circle>
                  <circle r="0.055" fill="#A56D58" opacity="0.8"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.8s" path="M2.5,0.5 L1.5,1.5"/></circle>
                  <circle r="0.055" fill="#BF8974" opacity="0.7"><animateMotion dur="2.6s" repeatCount="indefinite" begin="1.2s" path="M0.5,1.5 L1.5,1.5"/></circle>
                  <circle r="0.055" fill="#A56D58" opacity="0.8"><animateMotion dur="2.0s" repeatCount="indefinite" begin="0.2s" path="M2.5,1.5 L1.5,1.5"/></circle>
                  <circle r="0.055" fill="#1B2A4A" opacity="0.7"><animateMotion dur="3.0s" repeatCount="indefinite" begin="1.5s" path="M0.5,2.5 L1.5,1.5"/></circle>
                  <circle r="0.055" fill="#A56D58" opacity="0.8"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.6s" path="M1.5,2.5 L1.5,1.5"/></circle>
                  <circle r="0.055" fill="#BF8974" opacity="0.7"><animateMotion dur="2.3s" repeatCount="indefinite" begin="1.0s" path="M2.5,2.5 L1.5,1.5"/></circle>
                </svg>
                {/* Row 1 */}
                <div className="hm-node"><LogoSAP /><span>SAP</span></div>
                <div className="hm-node"><LogoWorkday /><span>Workday</span></div>
                <div className="hm-node"><LogoDynamics /><span>Dynamics 365</span></div>
                {/* Row 2 */}
                <div className="hm-node"><LogoOracle /><span>Oracle</span></div>
                <div className="hm-center"><img src="/logowebsite.png" alt="Dolphin AI" /></div>
                <div className="hm-node"><LogoSharePoint /><span>SharePoint</span></div>
                {/* Row 3 */}
                <div className="hm-node"><LogoCoupa /><span>Coupa</span></div>
                <div className="hm-node"><LogoAzure /><span>Azure AI</span></div>
                <div className="hm-node"><LogoExcel /><span>Excel</span></div>
              </div>
            </motion.div>

            {/* RIGHT: feature cards 2×2 */}
            <motion.div
              className="intsol-features-col"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <div className="intsol-band-label" style={{ justifyContent: 'flex-start', marginBottom: '12px' }}>
                <span>What we deliver</span>
                <span className="intsol-band-line" style={{ maxWidth: 80 }} />
              </div>
              <div className="intsol-cards-row">
                {features.map((f, i) => (
                  <motion.article
                    className="intsol-feat-card"
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.09 }}
                  >
                    <div className="intsol-feat-num">0{i + 1}</div>
                    <div className="intsol-feat-icon">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </motion.article>
                ))}
              </div>
            </motion.div>

          </div>

        </section>

        {/* ══ WORKFLOW ══ */}
        <section id="workflow" className="workflow-section">
          <div className="container">
            <div className="section-head centered">
              <span className="eyebrow">How it works</span>
              <h2>Turn complex spend data into savings.</h2>
              <div className="section-rule" />
              <p>Dolphin AI gives teams a repeatable workflow — import, clean, classify, validate, and export.</p>
            </div>
            <div className="steps-grid">
              {steps.map(s => (
                <div className="step-card" key={s.num}>
                  <div className="step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHO WE HELP ══ */}
        <section className="cases-section container">
          <div className="section-head centered">
            <span className="eyebrow">Who we help</span>
            <h2>Built for organizations where spend data is a problem</h2>
            <div className="section-rule" />
            <p>If any of these sound familiar, Dolphin AI was built for you.</p>
          </div>
          <div className="cases-grid">
            {[
              {
                industry: 'Manufacturing',
                icon: '🏭',
                challenge: 'Supplier names duplicated across multiple ERPs, no consistent taxonomy, and category reporting takes weeks instead of hours.',
                painPoints: [
                  'Thousands of duplicate supplier records',
                  'No unified spend taxonomy across plants',
                  'Monthly reporting takes 2–3 weeks to prepare',
                ],
              },
              {
                industry: 'Retail & Distribution',
                icon: '🛒',
                challenge: 'Organization teams spending 40+ hours per month manually cleaning and mapping spend data in Excel instead of driving strategy.',
                painPoints: [
                  'Tens of thousands of spend lines unclassified',
                  'Off-contract tail spend invisible to leadership',
                  'No time left for sourcing or negotiation',
                ],
              },
              {
                industry: 'Logistics & Transport',
                icon: '🚚',
                challenge: 'Spend visibility stops at Level 1 categories. Sourcing decisions are made on gut feel because the data can\'t be trusted.',
                painPoints: [
                  'No granular category breakdown below L1',
                  'Supplier consolidation opportunities missed',
                  'Finance and organization working from different numbers',
                ],
              },
              {
                industry: 'Healthcare & Life Sciences',
                icon: '🏥',
                challenge: 'Complex supplier landscape across medical devices, pharmaceuticals, and services with no unified structure across entities.',
                painPoints: [
                  'Inconsistent taxonomy across hospital entities',
                  'Contract compliance gaps impossible to track',
                  'Regulatory reporting slowed by messy data',
                ],
              },
              {
                industry: 'Financial Services',
                icon: '🏦',
                challenge: 'Organization operating across multiple countries or entities with inconsistent supplier master data and no cross-entity visibility.',
                painPoints: [
                  'No single view of spend across business units',
                  'Supplier risk impossible to quantify accurately',
                  'Indirect spend largely unmanaged and unclassified',
                ],
              },
            ].map(c => (
              <div className="case-card" key={c.industry}>
                <div className="case-header">
                  <div className="case-industry"><span style={{marginRight:8}}>{c.icon}</span>{c.industry}</div>
                </div>
                <p className="case-challenge">{c.challenge}</p>
                <ul className="case-results">
                  {c.painPoints.map(r => (
                    <li key={r}><CheckCircle2 size={14} />{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══ TRUST STATS ══ */}
        <section className="trust-stats-section">
          <div className="container">
            <div className="section-head centered">
              <span className="eyebrow">Why teams choose Dolphin AI</span>
              <h2>Built for the reality of organization data</h2>
              <div className="section-rule" />
            </div>
            <div className="trust-stats-grid">
              {[
                { value: '95%+',   label: 'Classification accuracy',        sub: 'Across L1–L4 taxonomy levels' },
                { value: '80%',    label: 'Less time on data cleaning',      sub: 'Compared to manual Excel work' },
                { value: '4×',     label: 'Faster category analysis',        sub: 'From raw data to insights' },
                { value: '<24h',   label: 'Time to first results',           sub: 'From data upload to classified output' },
                { value: '360°',   label: 'Supplier visibility',             sub: 'Normalized across all ERP sources' },
                { value: '100%',   label: 'Data stays yours',                sub: 'Never used for model training' },
              ].map(s => (
                <div className="trust-stat-card" key={s.label}>
                  <span className="trust-stat-value">{s.value}</span>
                  <strong className="trust-stat-label">{s.label}</strong>
                  <span className="trust-stat-sub">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <FaqSection />

      </main>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img src="/logowebsite.png" alt="Dolphin AI" className="footer-logo" />
            <p>Intelligent Spend Classification for modern organization and finance teams.</p>
            <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.35)', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Dolphin AI LLC<br />
              7301 N Highway 161, #148<br />
              Irving, TX 75039
            </p>
            <div className="footer-social">
              <a href="https://www.linkedin.com/company/dolphinaipro" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#platform">Platform</a>
              <Link to="/solution">Solution</Link>
              <a href="#workflow">Workflow</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About us</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/security">Security</Link>
              <Link to="/book-demo">Book a Demo</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Cookie Policy</Link>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>Copyright © 2026 Dolphin AI · dolphinaipro.com</p>
          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/privacy">Cookie Policy</Link>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/classify" element={<ClassifyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/book-demo" element={<BookDemoPage />} />
      <Route path="/demo-video" element={<DemoVideoPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/assessment" element={<AssessmentPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/reporting" element={<ReportingPage />} />
      <Route path="/scoping" element={<ScopingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/solution" element={<SolutionPage />} />
      <Route path="/power-bi" element={<PowerBIPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
