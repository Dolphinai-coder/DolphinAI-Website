import Navbar from './Navbar.jsx';
import useSEO from './useSEO.js';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers3, Building2, TrendingUp, Lightbulb, Database, Link2,
  CheckCircle2, ArrowRight, BookOpen, EyeOff, Sparkles, PieChart, DollarSign, ShieldCheck,
} from 'lucide-react';

const VALUE_POINTS = [
  { icon: <EyeOff size={18} />,     color: '#E06820', bg: '#FFF3EB', title: 'Eliminate Blindspots',     desc: 'Turns fragmented transactions into clear, actionable spend strategy.' },
  { icon: <Sparkles size={18} />,   color: '#7C3AED', bg: '#F5F0FF', title: 'Automate Data Cleanup',    desc: 'Automatically categorizes and cleans raw, messy expense data in minutes.' },
  { icon: <PieChart size={18} />,   color: '#0E8A5A', bg: '#E8F7F1', title: 'Full Spending Visibility', desc: 'Helps organization and finance teams see exactly where every dollar goes.' },
  { icon: <DollarSign size={18} />, color: '#B5620A', bg: '#FDF3E7', title: 'Uncover Hidden Savings',   desc: 'Surfaces hidden opportunities to cut costs and optimize purchasing.' },
  { icon: <ShieldCheck size={18}/>, color: '#0077B6', bg: '#E8F4FD', title: 'Reduce Financial Risk',    desc: 'Delivers accurate, boardroom-ready intelligence for smarter decisions.' },
];

const CAPABILITIES = [
  {
    id: 'spend-classification',
    icon: <Layers3 size={32} />,
    color: '#E06820',
    bg: '#FFF3EB',
    title: 'Spend Classification',
    tagline: 'Know exactly where every dollar goes',
    definition: 'Spend classification is the process of automatically categorizing every purchase transaction into a structured hierarchy — such as IT Hardware → Computers → Laptops. Without it, your organization data is just a list of numbers.',
    why: 'Most organizations have 30–50% of their spend either unclassified or misclassified. This makes it impossible to benchmark suppliers, identify savings, or report accurately to leadership.',
    how: 'Dolphin AI reads your raw transaction descriptions and maps each line to your chosen taxonomy (UNSPSC, custom, or hybrid) using a combination of large language models and your own business rules — with no manual effort.',
    benefits: [
      'Full Level 4 taxonomy depth automatically applied',
      'Works with any taxonomy — UNSPSC, custom, or hybrid',
      'Flags low-confidence predictions for human review',
      'Retrains on your corrections over time',
    ],
  },
  {
    id: 'supplier-normalization',
    icon: <Building2 size={32} />,
    color: '#1A6FB5',
    bg: '#EBF3FD',
    title: 'Supplier Normalization',
    tagline: 'One trusted identity for every supplier',
    definition: 'Supplier normalization is the process of recognizing that "Microsoft Corp", "MICROSOFT CORPORATION", "Microsoft Ltd" and "MSFT" are all the same vendor — and grouping them into a single, clean supplier record.',
    why: 'ERP systems accumulate years of typos, abbreviations, and duplicate entries. A single real supplier can appear under dozens of names, making spend totals meaningless and sourcing decisions unreliable.',
    how: 'Dolphin AI uses NLP similarity matching, fuzzy logic, and company database lookups to group all variants of a supplier into one canonical identity — giving you a single, trustworthy view of your supply base.',
    benefits: [
      'Automatically detects duplicates across all ERP sources',
      'Produces a confidence score for every merge decision',
      'Preserves original records — no data is deleted',
      'Surfaces hidden supplier concentration risk',
    ],
  },
  {
    id: 'spend-intelligence',
    icon: <TrendingUp size={32} />,
    color: '#0E8A5A',
    bg: '#E8F7F1',
    title: 'Spend Intelligence',
    tagline: 'From raw data to executive-ready insight',
    definition: 'Spend intelligence is the transformation of cleaned, classified transaction data into meaningful KPIs, trend charts, and category reports that organization and finance teams can actually act on.',
    why: 'Having data is not the same as having insight. Most teams spend 80% of their time preparing reports and only 20% acting on them. Spend intelligence reverses that ratio.',
    how: 'Once your data is cleaned and classified, Dolphin AI automatically generates category breakdowns, supplier league tables, period-over-period trends, and variance alerts — all exportable for board presentations.',
    benefits: [
      'Pre-built dashboards for leadership, category managers, and finance',
      'Category trend analysis and YoY variance',
      'Top-supplier heat maps and concentration reports',
      'One-click export to PowerPoint and Excel',
    ],
  },
  {
    id: 'opportunity-detection',
    icon: <Lightbulb size={32} />,
    color: '#B5620A',
    bg: '#FDF3E7',
    title: 'Opportunity Detection',
    tagline: 'Surface savings hidden in your own data',
    definition: 'Opportunity detection is the automatic identification of areas where your organization is overspending — such as tail spend with unmanaged vendors, off-contract purchases, duplicate suppliers, or categories ripe for renegotiation.',
    why: 'Research shows that 20–40% of total spend contains recoverable value that goes unnoticed without structured analysis. Manual audits take months and miss most of it.',
    how: 'Dolphin AI applies benchmark logic across five opportunity types — productivity, supplier consolidation, classification gaps, tail spend, and contract compliance — and quantifies each one in dollar terms specific to your data.',
    benefits: [
      'Five savings opportunity categories analyzed automatically',
      'Each finding is quantified with a dollar estimate',
      'Prioritized by impact so teams know where to focus first',
      'Links directly to supporting transaction-level evidence',
    ],
    cta: { label: 'Try the free ROI calculator', to: '/assessment' },
  },
  {
    id: 'data-enrichment',
    icon: <Database size={32} />,
    color: '#6B3FA0',
    bg: '#F3EEF9',
    title: 'Data Enrichment',
    tagline: 'Fill the gaps your ERP left behind',
    definition: 'Data enrichment is the process of automatically completing missing fields, correcting errors, and adding contextual data — such as supplier country, industry, or risk tier — to raw organization records.',
    why: 'ERP exports are notoriously incomplete: missing cost centres, blank descriptions, wrong currencies, and unverifiable supplier details. This makes downstream reporting inaccurate and compliance difficult.',
    how: 'Dolphin AI runs a multi-stage enrichment pipeline that detects anomalies, infers missing values from context, cross-references supplier databases, and flags records that still need human input — all before any analysis begins.',
    benefits: [
      'Detects blanks, inconsistencies, and formatting errors',
      'Infers missing categories from transaction descriptions',
      'Cross-references supplier records against public databases',
      'Produces a data quality score before and after processing',
    ],
  },
  {
    id: 'integrations',
    icon: <Link2 size={32} />,
    color: '#0077B6',
    bg: '#E8F4FD',
    title: 'Integrations',
    tagline: 'Works with the systems you already use',
    definition: 'Integrations are the connectors that allow Dolphin AI to pull spend data directly from your ERP, finance, and organization systems — without manual exports, reformatting, or IT projects.',
    why: 'Most organizations manage spend data across multiple disconnected systems. Manually exporting and combining files creates errors, delays, and version-control nightmares that undermine trust in the data.',
    how: 'Dolphin AI connects to SAP, Oracle, Microsoft Dynamics 365, Coupa, Workday, SharePoint, and Excel. Data is pulled, normalized into a unified schema, and refreshed on a schedule — so your reports are always current.',
    benefits: [
      'Native connectors for SAP, Oracle, Dynamics 365, Coupa',
      'Excel and CSV upload for any other source',
      'Automated refresh schedules — no manual exports',
      'All data processed in your security boundary',
    ],
  },
];

export default function ProductPage() {
  useSEO({ title: 'Product — AI Spend Classification & Supply Chain Analytics | Dolphin AI', description: 'Explore Dolphin AI capabilities: spend classification, supplier normalization, opportunity detection, and ERP integrations for SAP, Oracle, Coupa, and MS Dynamics.' });
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="site">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="prod-hero">
          <div className="container prod-hero-inner">
            <span className="eyebrow">Platform capabilities</span>
            <h1>Your spend data has answers. Dolphin AI helps you find them.</h1>

            {/* Value points — between title and description */}
            <div className="prod-value-grid">
              {VALUE_POINTS.map(v => (
                <div className="prod-value-card" key={v.title}>
                  <span className="prod-value-icon" style={{ background: v.bg, color: v.color }}>{v.icon}</span>
                  <div>
                    <strong>{v.title}</strong>
                    <p>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="prod-hero-sub">Six core capabilities work together to take your organization data from raw and unreliable to structured, enriched, and ready for decisions.</p>
            <div className="prod-hero-caps">
              {CAPABILITIES.map(c => (
                <a key={c.id} href={`#${c.id}`} className="prod-hero-chip">
                  <span style={{ color: c.color }}>{c.icon && <span className="prod-chip-icon" style={{ background: c.bg }}>{c.icon}</span>}</span>
                  {c.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Capability sections */}
        <div className="prod-sections container">
          {CAPABILITIES.map((cap, i) => (
            <section key={cap.id} id={cap.id} className={`prod-cap-section ${i % 2 === 1 ? 'prod-cap-alt' : ''}`}>
              <div className="prod-cap-inner">

                {/* Left: text */}
                <div className="prod-cap-text">
                  <div className="prod-cap-eyebrow" style={{ color: cap.color }}>
                    <span className="prod-cap-icon-sm" style={{ background: cap.bg, color: cap.color }}>{cap.icon}</span>
                    {cap.title}
                  </div>
                  <h2>{cap.tagline}</h2>

                  {/* Definition box */}
                  <div className="prod-definition">
                    <div className="prod-def-label"><BookOpen size={13} /> What is {cap.title}?</div>
                    <p>{cap.definition}</p>
                  </div>

                  <div className="prod-why">
                    <strong>Why it matters</strong>
                    <p>{cap.why}</p>
                  </div>

                  <div className="prod-how">
                    <strong>How Dolphin AI does it</strong>
                    <p>{cap.how}</p>
                  </div>

                  {cap.cta && (
                    <Link to={cap.cta.to} className="btn btn-outline" style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {cap.cta.label} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Right: benefits card */}
                <div className="prod-cap-card" style={{ borderColor: cap.color + '22', background: cap.bg }}>
                  <p className="prod-card-label" style={{ color: cap.color }}>Key benefits</p>
                  <ul className="prod-benefit-list">
                    {cap.benefits.map(b => (
                      <li key={b}>
                        <CheckCircle2 size={15} style={{ color: cap.color, flexShrink: 0 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <section className="prod-cta">
          <div className="container prod-cta-inner">
            <h2>Ready to see these capabilities on your own data?</h2>
            <p>Book a Demo and we'll show you how each module applies to your specific organization setup.</p>
            <div className="prod-cta-btns">
              <Link to="/book-demo" className="btn btn-primary btn-lg">Book a Demo <ArrowRight size={15} /></Link>
              <Link to="/assessment" className="btn btn-primary btn-lg">Try the free ROI calculator <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-bottom">
          <p>Copyright © 2026 Dolphin AI</p>
          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
