// Reads blog-posts.xlsx and updates src/blog-posts.json
// Run with: npm run update-blog

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const xlsxPath = path.join(__dirname, '../blog-posts.xlsx');
const jsonPath = path.join(__dirname, '../src/blog-posts.json');

if (!fs.existsSync(xlsxPath)) {
  console.error('❌ blog-posts.xlsx not found. Run: npm run create-excel');
  process.exit(1);
}

// Reads the real pixel dimensions of a published image so the page can reserve
// the right space and avoid layout shift. Images are not all 16:9.
function imageSize(src) {
  const file = path.join(__dirname, '..', 'public', src.replace(/^\//, ''));
  const candidates = [file, file.replace(/\.webp$/, '.jpg'), file.replace(/\.webp$/, '.png')];
  for (const f of candidates) {
    if (!fs.existsSync(f)) continue;
    const buf = fs.readFileSync(f);
    if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };   // PNG IHDR
    }
    if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') {
      const fmt = buf.slice(12, 16).toString();
      if (fmt === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      if (fmt === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (fmt === 'VP8L') {
        const b = buf.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
    }
    for (let i = 2; i < buf.length - 9; ) {              // JPEG SOFn
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  console.warn(`   ⚠ could not read dimensions for ${src} — falling back to 16:9`);
  return { width: 1200, height: 675 };
}

// Block syntax used in the Excel "Content" column:
//   # Title            -> skipped (the Title column already holds it)
//   ## Heading         -> heading
//   ### Subheading     -> subheading
//   >> Callout         -> callout
//   - item             -> list (consecutive lines in one block)
//   !! src | alt | cap -> image
//   anything else      -> paragraph
// Inline **bold** is preserved and rendered by BlogPostPage.
function textToContent(text) {
  if (!text) return [];
  let t = String(text).trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1); // Excel wrapped the cell in quotes

  return t.split(/\n\n+/).map(block => {
    block = block.trim();
    if (!block) return null;

    if (block.startsWith('!! ')) {
      const [src, alt, caption] = block.slice(3).split('|').map(s => s.trim());
      const { width, height } = imageSize(src);
      return { type: 'image', src, alt: alt || '', caption: caption || '', width, height };
    }
    if (block.startsWith('### ')) return { type: 'subheading', text: block.slice(4).trim() };
    if (block.startsWith('## '))  return { type: 'heading',    text: block.slice(3).trim() };
    if (block.startsWith('# '))   return null;                       // duplicate of the Title column
    if (block.startsWith('>> '))  return { type: 'callout',    text: block.slice(3).trim() };

    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length && lines.every(l => l.startsWith('- '))) {
      return { type: 'list', items: lines.map(l => l.slice(2).trim()) };
    }
    return { type: 'paragraph', text: lines.join(' ') };
  }).filter(Boolean);
}

const wb   = XLSX.readFile(xlsxPath);
const ws   = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws);

// The sheet's flag column has been called both "Featured" and "Status"; accept either.
const isFeatured = row =>
  String(row['Featured'] ?? row['Status'] ?? '').trim().toUpperCase() === 'YES';

const posts = rows.map(row => ({
  slug:     String(row['Slug (URL)'] || '').trim(),
  title:    String(row['Title']       || '').trim(),
  category: String(row['Category']   || '').trim(),
  date:     String(row['Date']        || '').trim().split(' ')[0],
  author:   String(row['Author']      || 'Dolphin AI Team').trim(),
  readTime: String(row['Read Time']   || '5 min read').trim(),
  featured: isFeatured(row),
  excerpt:  String(row['Excerpt']     || '').trim(),
  hero:     String(row['Hero Image']  || '').trim(),
  content:  textToContent(row['Content']),
})).filter(p => p.slug && p.title)
   .sort((a, b) => (b.date || '').localeCompare(a.date || ''));   // newest first

fs.writeFileSync(jsonPath, JSON.stringify(posts, null, 2));
console.log(`✅ Updated blog-posts.json — ${posts.length} articles`);
posts.forEach(p => {
  const imgs = p.content.filter(b => b.type === 'image').length;
  console.log(`   • ${p.featured ? '⭐ ' : '  '}${p.title}  (${p.content.length} blocks${imgs ? `, ${imgs} images` : ''})`);
});
