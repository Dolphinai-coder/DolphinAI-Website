import Navbar from './Navbar.jsx';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="site">
      <Navbar />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2rem)', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--gray-400)', fontSize: '13.5px', marginBottom: '2.5rem' }}>Last updated: May 2026</p>
        {[
          { title: '1. Who we are', body: 'Dolphin AI ("we", "our", "us") is a organization intelligence platform operated by Dolphin AI LLC, 7301 N Highway 161, #148, Irving, TX 75039. We process spend data on behalf of our clients to provide spend classification, supplier normalization, and analytics services. Contact: info@dolphinaipro.com' },
          { title: '2. Data we collect', body: 'We collect data you provide directly (name, company, work email when you sign up or book a demo), usage data (pages visited, features used), and spend data uploaded or connected by your organization for classification purposes.' },
          { title: '3. How we use your data', body: 'We use your data to provide and improve our services, send you relevant product updates and demo confirmations, and respond to your enquiries. We do not sell your personal data to third parties.' },
          { title: '4. Spend data security', body: 'All spend data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Data is stored on enterprise-grade cloud infrastructure in the EU. Your spend data is never used to train AI models or shared with other clients.' },
          { title: '5. Cookies', body: 'We use essential cookies for session management and analytics cookies (with your consent) to understand how our platform is used. You can manage cookie preferences at any time.' },
          { title: '6. Data retention', body: 'We retain personal data for as long as your account is active. Spend data uploaded for classification is retained for 90 days after project completion, then deleted. You may request deletion at any time.' },
          { title: '7. Your rights', body: 'Under GDPR you have the right to access, correct, delete, or export your personal data. To exercise these rights, contact us at info@dolphinaipro.com. We respond to all requests within 30 days.' },
          { title: '8. Changes to this policy', body: 'We may update this policy periodically. We will notify you of significant changes by email or via the platform. Continued use of our services after changes constitutes acceptance.' },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.5rem' }}>{s.title}</h2>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </main>
      <footer className="footer">
        <div className="container footer-bottom">
          <p>Copyright © 2026 Dolphin AI</p>
          <div><Link to="/privacy">Privacy Policy</Link><Link to="/privacy">Cookie Policy</Link></div>
        </div>
      </footer>
    </div>
  );
}
