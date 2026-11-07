import Navbar from './Navbar.jsx';
import useSEO from './useSEO.js';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Database, Zap, Layers3, BarChart3, TrendingUp, AlertTriangle, XCircle, ArrowDown } from 'lucide-react';

/* ── Messy raw data example ── */
const RAW_DATA = [
  { supplier: 'MICROSOFT CORP',        desc: 'INV-2024-0012',         category: '',                  amount: '$12,450' },
  { supplier: 'microsoft ltd',         desc: 'Software renewal',       category: 'IT',                amount: '$8,200'  },
  { supplier: 'Microsft Corporation',  desc: 'Azure cloud services',   category: '',                  amount: '$31,000' },
  { supplier: 'STAPLES INC.',          desc: 'office suplies misc',    category: 'General',           amount: '$340'    },
  { supplier: 'Staples',               desc: '',                       category: '',                  amount: '$215'    },
  { supplier: 'DHL GLOBAL',           desc: 'Freight charges Q3',     category: 'logistics',         amount: '$4,800'  },
  { supplier: 'D.H.L Express',         desc: 'shipping',               category: 'Logistics',         amount: '$1,200'  },
  { supplier: 'UNKNOWN VENDOR 004',    desc: 'PO 88821',               category: '',                  amount: '$6,700'  },
];

/* ── Clean data after processing ── */
const CLEAN_DATA = [
  { supplier: 'Microsoft Corporation', desc: 'Software license renewal',      category: 'IT > Software > Subcription/License',          amount: '$12,450', conf: 99 },
  { supplier: 'Microsoft Corporation', desc: 'Software license renewal',      category: 'IT > Software > Subcription/License',          amount: '$8,200',  conf: 99 },
  { supplier: 'Microsoft Corporation', desc: 'Cloud infrastructure services', category: 'IT > Network > Cloud Services',                amount: '$31,000', conf: 97 },
  { supplier: 'Staples Inc.',          desc: 'Office supplies — miscellaneous',category: 'Admin > Office Supplies & Equipment > Paper',  amount: '$340',    conf: 94 },
  { supplier: 'Staples Inc.',          desc: 'Office supplies — miscellaneous',category: 'Admin > Office Supplies & Equipment > Paper',  amount: '$215',    conf: 94 },
  { supplier: 'DHL Global Forwarding', desc: 'Freight charges Q3',            category: 'Logistics > Transportation > Freight Forwarder',amount: '$4,800',  conf: 98 },
  { supplier: 'DHL Global Forwarding', desc: 'International shipping',        category: 'Logistics > Transportation > Freight Forwarder',amount: '$1,200',  conf: 98 },
  { supplier: 'Consolidated Vendors',  desc: 'Purchase order #88821',         category: 'MRO > MRO Other > MRO Other',                  amount: '$6,700',  conf: 71 },
];

const PHASES = [
  {
    number: '01',
    color: '#0369a1',
    bg: '#e0f2fe',
    icon: <Database size={22}/>,
    title: 'Data Ingestion',
    duration: 'Days 1–3',
    what: 'We connect to your source systems, extract all spend data, and run an initial completeness check. Access setup, data transfer, and format validation all happen in this phase.',
    how: [
      'Direct connector to SAP, Oracle, Dynamics 365, Coupa, or Workday',
      'Excel / CSV upload for any additional sources',
      'All data encrypted in transit and processed in your security boundary',
      'A full data inventory report is generated before moving to cleaning',
    ],
    stat: { value: '1–3 days', label: 'Typical ingestion window' },
  },
  {
    number: '02',
    color: '#ca8a04',
    bg: '#fefce8',
    icon: <Zap size={22}/>,
    title: 'Automated Cleaning',
    duration: 'Days 3–8',
    what: 'AI scans every record for errors, blanks, duplicates, and inconsistencies — then fixes them automatically, flagging anything it can\'t resolve with confidence.',
    how: [
      'Supplier name deduplication using NLP fuzzy matching',
      'Blank fields inferred from context and transaction history',
      'Formatting standardized across all sources (dates, currencies, codes)',
      'Every change logged with reason — full audit trail maintained',
    ],
    stat: { value: '87%', label: 'Of issues resolved automatically' },
  },
  {
    number: '03',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: <Layers3 size={22}/>,
    title: 'Spend Classification',
    duration: 'Days 6–14',
    what: 'Every transaction is mapped to your taxonomy — down to Level 4 — using a combination of AI and your own business rules. Low-confidence results are flagged for human review.',
    how: [
      'Works with any taxonomy: UNSPSC, custom, or hybrid',
      'Confidence score assigned to every classification',
      'Low-confidence items surfaced in a review queue — not silently accepted',
      'Your corrections feed back into the model for continuous improvement',
    ],
    stat: { value: '95%+', label: 'Classification accuracy' },
  },
  {
    number: '04',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: <TrendingUp size={22}/>,
    title: 'Enrichment & Validation',
    duration: 'Days 10–18',
    what: 'Cleaned and classified data is enriched with supplier intelligence — country of origin, industry, risk tier, and contract status — then validated before any dashboard is published.',
    how: [
      'Supplier records cross-referenced against public business databases',
      'Risk tiers assigned based on spend concentration and geography',
      'Contract compliance flags applied where contract data is available',
      'A pre-delivery data quality score is generated for your records',
    ],
    stat: { value: '100%', label: 'Records validated before delivery' },
  },
  {
    number: '05',
    color: '#E06820',
    bg: '#fff3eb',
    icon: <BarChart3 size={22}/>,
    title: 'Dashboard Delivery',
    duration: 'Days 14–30',
    what: 'Your dashboards go live. Every KPI, chart, and table updates automatically as new transactions arrive. No manual refresh, no exports, no waiting.',
    how: [
      'Pre-built views for leadership, category managers, and finance',
      'Spend by category (L1–L4), supplier rankings, trend charts',
      'Anomaly alerts and savings opportunities surfaced automatically',
      'Export to PDF, Excel, or CSV in one click',
    ],
    stat: { value: 'Day 14–30', label: 'First live dashboard' },
  },
];

const SCENARIOS = [
  {
    label: 'Starter',
    color: '#E06820',
    bg: '#fff8f2',
    border: '#fde0c4',
    spend: 'Under $100M',
    lines: 'Under 20K lines',
    sources: '1–2 systems',
    quality: 'Mixed',
    timeline: '7–14 days',
    cleanup: '10–20%',
    accuracy: '95%+',
    duplicates: '5–15%',
    savings: '3–5% of spend',
    notes: 'Fastest path to results. Single-pass cleaning and classification. Dashboard typically delivered in the second week.',
  },
  {
    label: 'Growth',
    color: '#C05818',
    bg: '#fff3eb',
    border: '#fcd9bc',
    spend: '$100M – $500M',
    lines: '20K – 100K lines',
    sources: '2–4 systems',
    quality: 'Mostly messy',
    timeline: '2–4 weeks',
    cleanup: '20–40%',
    accuracy: '95%+',
    duplicates: '15–30%',
    savings: '4–8% of spend',
    notes: 'Multi-source reconciliation required. Supplier master typically contains significant duplicates. Two-pass classification recommended.',
  },
  {
    label: 'Enterprise',
    color: '#1B2A4A',
    bg: '#f0f3f8',
    border: '#c8d4e8',
    spend: '$500M – $2B',
    lines: '100K – 500K lines',
    sources: '4–8 systems',
    quality: 'Very messy',
    timeline: '4–8 weeks',
    cleanup: '35–55%',
    accuracy: '95%+',
    duplicates: '25–40%',
    savings: '5–10% of spend',
    notes: 'Complex multi-ERP environment. Taxonomy alignment across business units. Phased delivery — first category dashboard by week 3, full rollout by week 8.',
  },
  {
    label: 'Global',
    color: '#111111',
    bg: '#f5f5f5',
    border: '#d0d0d0',
    spend: 'Over $2B',
    lines: '500K+ lines',
    sources: '8+ systems',
    quality: 'Very messy + multi-currency',
    timeline: '8–16 weeks',
    cleanup: '45–65%',
    accuracy: '95%+',
    duplicates: '30–50%',
    savings: '6–12% of spend',
    notes: 'Multi-entity, multi-currency, multi-language environment. Dedicated project manager assigned. Weekly progress reporting. Phased rollout by entity or region.',
  },
];

function DataIssueTag({ type }) {
  const styles = {
    duplicate: { bg: '#fef2f2', color: '#dc2626', label: 'Duplicate' },
    blank:     { bg: '#fefce8', color: '#ca8a04', label: 'Blank field' },
    typo:      { bg: '#fff7ed', color: '#ea580c', label: 'Typo' },
    vague:     { bg: '#f5f3ff', color: '#7c3aed', label: 'Too vague' },
    unknown:   { bg: '#f1f5f9', color: '#64748b', label: 'Unknown vendor' },
  };
  const s = styles[type] || styles.vague;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

export default function OnboardingPage() {
  useSEO({ title: 'How Dolphin AI Onboarding Works — Go Live in 14–30 Days', description: 'Step-by-step onboarding process for Dolphin AI: data ingestion, cleaning, classification, and reporting — live in as little as 14 days with no IT resources required.' });
  return (
    <div className="site">
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section style={{ background: 'linear-gradient(135deg, #111111 0%, #1E1E1E 45%, #C05818 80%, #E06820 100%)', padding: '100px 0 80px', color: '#fff' }}>
          <div className="container" style={{ maxWidth: 760, textAlign: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fcd9bc', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 20 }}>
              How it works
            </span>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, margin: '20px 0 16px', lineHeight: 1.1 }}>
              From raw, messy spend data<br/>
              <span style={{ color: '#F07830' }}>to actionable intelligence</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 }}>
              Here's exactly what happens to your data from the moment you share it — every step, every fix, every result.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: <Clock size={14}/>, text: 'First results in 14–30 days' },
                { icon: <CheckCircle2 size={14}/>, text: '95%+ classification accuracy' },
                { icon: <Database size={14}/>, text: 'No IT project required' },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.12)', padding: '8px 16px', borderRadius: 20, fontSize: 13, color: '#fff' }}>
                  {b.icon}{b.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Before: The problem ── */}
        <section style={{ padding: '80px 0 60px', background: '#fafafa' }}>
          <div className="container" style={{ maxWidth: 1000 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="eyebrow">What we typically receive</span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', marginTop: 8 }}>This is what your raw ERP export looks like</h2>
              <p style={{ color: '#6b7280', maxWidth: 560, margin: '12px auto 0' }}>
                Before Dolphin AI, this is the reality. Duplicates, blanks, typos, and vague categories that make spend analysis impossible.
              </p>
            </div>

            {/* Raw data table */}
            <div style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#fef2f2', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #fecaca' }}>
                <XCircle size={16} style={{ color: '#dc2626' }}/>
                <span style={{ fontWeight: 700, color: '#dc2626', fontSize: 14 }}>Raw ERP Export — Before Processing</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>8 rows shown · 7 issues detected</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      {['Supplier Name', 'Description', 'Category', 'Amount', 'Issues'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ...RAW_DATA[0], issues: ['duplicate', 'blank'] },
                      { ...RAW_DATA[1], issues: ['duplicate'] },
                      { ...RAW_DATA[2], issues: ['duplicate', 'typo', 'blank'] },
                      { ...RAW_DATA[3], issues: ['vague'] },
                      { ...RAW_DATA[4], issues: ['duplicate', 'blank', 'blank'] },
                      { ...RAW_DATA[5], issues: [] },
                      { ...RAW_DATA[6], issues: ['duplicate', 'typo'] },
                      { ...RAW_DATA[7], issues: ['unknown', 'blank'] },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: row.issues.length ? '#fffbfb' : '#fff' }}>
                        <td style={{ padding: '10px 16px', color: row.issues.includes('typo') || row.issues.includes('duplicate') ? '#dc2626' : '#1B2A4A', fontWeight: 500 }}>{row.supplier}</td>
                        <td style={{ padding: '10px 16px', color: row.desc ? '#374151' : '#d1d5db', fontStyle: row.desc ? 'normal' : 'italic' }}>{row.desc || '(empty)'}</td>
                        <td style={{ padding: '10px 16px', color: row.category ? '#374151' : '#d1d5db', fontStyle: row.category ? 'normal' : 'italic' }}>{row.category || '(empty)'}</td>
                        <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{row.amount}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {row.issues.map((iss, j) => <DataIssueTag key={j} type={iss}/>)}
                            {row.issues.length === 0 && <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Duplicate supplier records', value: '5', color: '#dc2626' },
                { label: 'Blank category fields', value: '5', color: '#ca8a04' },
                { label: 'Blank descriptions', value: '2', color: '#ca8a04' },
                { label: 'Typos / name variants', value: '3', color: '#ea580c' },
                { label: 'Unknown vendors', value: '1', color: '#64748b' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Dolphin AI processes this automatically</span>
                <ArrowDown size={28} style={{ color: '#E06820' }}/>
              </div>
            </div>

            {/* Clean data table */}
            <div style={{ background: '#fff', border: '1.5px solid #bbf7d0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(22,163,74,0.08)' }}>
              <div style={{ background: '#f0fdf4', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #bbf7d0' }}>
                <CheckCircle2 size={16} style={{ color: '#16a34a' }}/>
                <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 14 }}>Processed Output — After Dolphin AI</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>All issues resolved · Classified to L3</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      {['Supplier (Normalized)', 'Description', 'Category Path', 'Amount', 'Confidence'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CLEAN_DATA.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 16px', color: '#1B2A4A', fontWeight: 600 }}>{row.supplier}</td>
                        <td style={{ padding: '10px 16px', color: '#374151' }}>{row.desc}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>{row.category}</span>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{row.amount}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ height: 6, width: 60, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${row.conf}%`, background: row.conf > 90 ? '#16a34a' : '#ca8a04', borderRadius: 99 }}/>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: row.conf > 90 ? '#16a34a' : '#ca8a04' }}>{row.conf}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── The 5 phases ── */}
        <section style={{ padding: '80px 0', background: '#fff' }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span className="eyebrow">The process</span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', marginTop: 8 }}>5 phases, fully automated</h2>
              <p style={{ color: '#6b7280', maxWidth: 500, margin: '12px auto 0' }}>
                Here's exactly what happens behind the scenes — and what you'll see at each stage.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {PHASES.map((phase, i) => (
                <div key={phase.number} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, alignItems: 'start' }}>

                  {/* Left: phase number + stat */}
                  <div style={{ textAlign: 'center', paddingTop: 8 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: phase.bg, color: phase.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>
                      {phase.icon}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{phase.duration}{phase.number === '05' ? '5–14' : ''}</div>
                    <div style={{ background: phase.bg, border: `1.5px solid ${phase.color}22`, borderRadius: 12, padding: '14px 10px', marginTop: 8 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: phase.color }}>{phase.stat.value}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, lineHeight: 1.3 }}>{phase.stat.label}</div>
                    </div>
                  </div>

                  {/* Right: content */}
                  <div style={{ background: '#fafafa', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '28px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: phase.color, background: phase.bg, padding: '3px 10px', borderRadius: 20 }}>Phase {phase.number}</span>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1B2A4A', margin: 0 }}>{phase.title}</h3>
                    </div>
                    <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: 20, fontSize: 15 }}>{phase.what}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {phase.how.map(h => (
                        <div key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <CheckCircle2 size={15} style={{ color: phase.color, flexShrink: 0, marginTop: 2 }}/>
                          <span style={{ fontSize: 14, color: '#374151' }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Standard Estimation Table ── */}
        <section style={{ padding: '80px 0', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: 1100 }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="eyebrow">Standard estimates</span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', marginTop: 8 }}>What to expect based on your situation</h2>
              <p style={{ color: '#6b7280', maxWidth: 560, margin: '12px auto 0' }}>
                Every project is different, but here are honest benchmarks based on real organization data we've worked with.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
              {SCENARIOS.map(s => (
                <div key={s.label} style={{ background: '#fff', border: `2px solid ${s.border}`, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: s.bg, padding: '20px 24px', borderBottom: `1px solid ${s.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#1B2A4A', marginBottom: 4 }}>⏱ {s.timeline}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>to first live dashboard</div>
                  </div>
                  <div style={{ padding: '20px 24px', flex: 1 }}>
                    {[
                      { label: 'Annual spend',        value: s.spend },
                      { label: 'Transaction volume',  value: s.lines },
                      { label: 'Data sources',        value: s.sources },
                      { label: 'Data quality',        value: s.quality },
                      { label: 'Records to clean',    value: s.cleanup },
                      { label: 'Classification',      value: s.accuracy },
                      { label: 'Duplicate suppliers', value: s.duplicates },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f3f4f6', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2A4A', textAlign: 'right' }}>{row.value}</span>
                      </div>
                    ))}
                    <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 16, lineHeight: 1.5 }}>{s.notes}</p>
                  </div>
                  <div style={{ padding: '16px 24px', borderTop: `1px solid ${s.border}` }}>
                    <Link to="/book-demo" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: s.color, border: 'none', fontSize: 13 }}>
                      Get a detailed proposal <ArrowRight size={13}/>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, background: 'linear-gradient(135deg, #1A1A1A 0%, #2a2a2a 60%, #7a3010 100%)', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <AlertTriangle size={24} style={{ color: '#E06820', flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>These are conservative estimates</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>Real timelines depend on data access speed, IT response time, and taxonomy complexity. In a live demo we'll give you a project-specific estimate.</div>
              </div>
              <Link to="/scoping" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 8, flexShrink: 0, whiteSpace: 'nowrap', fontWeight: 700 }}>
                Use the scoping tool <ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '80px 0', background: '#fff', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <span className="eyebrow">Ready to start?</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', margin: '12px 0 16px' }}>See this on your actual data</h2>
            <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
              In a 30-minute demo we connect to a sample of your data and walk you through exactly what your project will look like — timeline, cleanup rate, and first category report.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/book-demo" className="btn btn-primary btn-lg">Book a Demo <ArrowRight size={15}/></Link>
              <Link to="/scoping" className="btn btn-outline btn-lg">Estimate my project <ArrowRight size={15}/></Link>
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
