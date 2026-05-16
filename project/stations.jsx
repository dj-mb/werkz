// Shared station data + sketchy mountain SVG used across all variations.

const STATIONS = [
  { id: 'knkx',     name: 'KNKX',           freq: '88.5 FM',  genre: 'Jazz / NPR',     stream: 'https://knkx-live-a.edge.audiocdn.com/6284_128k', tag: 'Public radio' },
  { id: 'king',     name: 'KING FM',        freq: '98.1 FM',  genre: 'Classical',      stream: '', tag: 'Symphonic' },
  { id: 'jazz24',   name: 'Jazz24',         freq: 'Online',   genre: 'Jazz',           stream: '', tag: '24/7 jazz' },
  { id: 'movin',    name: 'MOViN 92.5',     freq: '92.5 FM',  genre: 'Pop hits',       stream: '', tag: 'Top 40' },
  { id: 'hot',      name: 'Hot 103.7',      freq: '103.7 FM', genre: 'Hip-hop / R&B',  stream: '', tag: 'Urban' },
  { id: 'classic',  name: 'UK Classic FM',  freq: 'Online',   genre: 'Classical',      stream: 'http://ice-the.musicradio.com/ClassicFMMP3', tag: 'London' },
  { id: 'kexp',     name: 'KEXP',           freq: '90.3 FM',  genre: 'Indie / Eclectic', stream: '', tag: 'DJ-curated' },
  { id: 'kuow',     name: 'KUOW',           freq: '94.9 FM',  genre: 'News / Talk',    stream: '', tag: 'NPR member' },
  { id: 'kbcs',     name: 'KBCS',           freq: '91.3 FM',  genre: 'Folk / World',   stream: '', tag: 'Community' },
  { id: 'kplu',     name: 'C89.5',          freq: '89.5 FM',  genre: 'Dance / EDM',    stream: '', tag: 'Student-run' },
  { id: 'kzok',     name: 'KZOK',           freq: '102.5 FM', genre: 'Classic rock',   stream: '', tag: 'Rock' },
  { id: 'kbks',     name: 'STAR 101.5',     freq: '101.5 FM', genre: 'Adult contemporary', tag: 'Variety' },
];

// Real Mount Rainier photograph as a faded backdrop. The image is rendered
// at low opacity and washed with the paper-tone background color so it sits
// behind the wireframe without competing for attention.
function MountRainier({ opacity = 0.18, style = {} }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}>
      <img src="assets/mt-rainier.jpg" alt="Mount Rainier"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 35%',
          opacity, filter: 'saturate(0.85) contrast(0.95)',
        }} />
      {/* Paper-tone wash so the photo blends into the wireframe palette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(253,251,245,0.35) 0%, rgba(253,251,245,0.55) 70%, rgba(253,251,245,0.85) 100%)',
      }} />
    </div>
  );
}

// Reusable sketchy frame box — wraps content with a hand-drawn double border.
function SketchBox({ children, style = {}, color = '#1a3a5c', strokeWidth = 1.5, dashed = false }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <rect x="1" y="1" width="98" height="98" fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={dashed ? '4 3' : ''} vectorEffect="non-scaling-stroke" />
        <rect x="2.5" y="2.5" width="95" height="95" fill="none" stroke={color} strokeWidth={strokeWidth * 0.6}
          strokeDasharray={dashed ? '4 3' : ''} vectorEffect="non-scaling-stroke" opacity="0.5" />
      </svg>
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </div>
  );
}

// Sketchy underline scribble for headlines.
function Scribble({ width = 120, color = '#2c5e3f' }) {
  return (
    <svg width={width} height="6" viewBox="0 0 120 6" style={{ display: 'block' }}>
      <path d="M 2 3 Q 20 1 40 3 T 80 3 T 118 3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Sketchy circle button (play, pause, skip).
function SketchCircle({ size = 48, color = '#1a3a5c', children, onClick, filled = false, fillColor = '#2c5e3f' }) {
  return (
    <button onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%', border: 'none',
        background: 'transparent', position: 'relative', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, color: filled ? '#fdfbf5' : color,
      }}>
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <circle cx="50" cy="50" r="46" fill={filled ? fillColor : 'none'} stroke={color} strokeWidth="1.8" />
        <circle cx="50" cy="50" r="43" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      </svg>
      <span style={{ position: 'relative', zIndex: 1, display: 'flex' }}>{children}</span>
    </button>
  );
}

Object.assign(window, { STATIONS, MountRainier, SketchBox, Scribble, SketchCircle });
