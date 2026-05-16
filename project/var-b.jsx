// Variation B — Card grid stations + bottom dock player.
// Stations as a 3-column scrolling grid; mini player docked at the bottom.

function VariationB({ mountainOpacity = 0.18 }) {
  const r = useRadio();
  const np = r.current ? getNowPlaying(r.current.id) : null;
  const W = 1100, H = 720;

  return (
    <div style={{ width: W, height: H, position: 'relative', background: '#fdfbf5', overflow: 'hidden', fontFamily: '"Caveat", "Comic Sans MS", cursive' }}>
      <MountRainier opacity={mountainOpacity} />

      <div style={{ position: 'absolute', top: 24, left: 36, right: 36, zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#1a3a5c', letterSpacing: '-0.5px' }}>Salish Sound</div>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a' }}>// CARD GRID · v2</div>
        </div>
        <Scribble width={140} color="#a8501e" />
      </div>

      {/* Grid of station cards */}
      <div style={{ position: 'absolute', top: 100, left: 36, right: 36, bottom: 160, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {STATIONS.map((s) => {
            const active = r.currentId === s.id;
            const fav = r.favorites.includes(s.id);
            return (
              <SketchBox key={s.id} style={{ height: 150, padding: 14, background: active ? 'rgba(44,94,63,0.14)' : 'rgba(253,251,245,0.85)', cursor: 'pointer' }}
                color={active ? '#2c5e3f' : '#1a3a5c'}>
                <div onClick={() => r.togglePlay(s.id)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 24, color: '#1a3a5c', lineHeight: 1 }}>{s.name}</div>
                      <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', marginTop: 4 }}>
                        {s.freq}
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); r.toggleFavorite(s.id); }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: fav ? '#a8501e' : '#1a3a5c' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2 L14.5 8.5 L21.5 9 L16 13.5 L18 21 L12 17 L6 21 L8 13.5 L2.5 9 L9.5 8.5 Z" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a' }}>
                      {s.genre}
                    </div>
                    <SketchCircle size={32} color={active ? '#2c5e3f' : '#1a3a5c'} filled={active && r.playing} fillColor="#2c5e3f">
                      {active && r.playing
                        ? <svg width="10" height="10" viewBox="0 0 10 10"><rect x="2" y="1" width="2" height="8" fill="currentColor"/><rect x="6" y="1" width="2" height="8" fill="currentColor"/></svg>
                        : <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 1 L9 5 L2 9 Z" fill="currentColor"/></svg>}
                    </SketchCircle>
                  </div>
                </div>
              </SketchBox>
            );
          })}
        </div>
      </div>

      {/* Bottom dock player */}
      <SketchBox style={{ position: 'absolute', bottom: 24, left: 36, right: 36, height: 120, padding: 16, background: 'rgba(253,251,245,0.95)' }} color="#2c5e3f">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: '100%' }}>
          {/* Thumbnail */}
          <SketchBox style={{ width: 88, height: 88, flexShrink: 0, background: 'repeating-linear-gradient(45deg, rgba(26,58,92,0.06) 0 6px, transparent 6px 12px)' }} color="#1a3a5c" dashed>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#1a3a5c" strokeWidth="1.5">
                <circle cx="16" cy="16" r="14" />
                <circle cx="16" cy="16" r="2.5" fill="#1a3a5c" />
              </svg>
            </div>
          </SketchBox>

          {/* Meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a' }}>
              {r.buffering ? '[ buffering… ]' : r.playing ? '[ on air · live ]' : '[ paused ]'}
            </div>
            <div style={{ fontSize: 24, color: '#1a3a5c', lineHeight: 1.1, marginTop: 2 }}>
              {r.current ? r.current.name : '— pick a station —'}
            </div>
            {np && (
              <div style={{ fontSize: 16, color: '#2c5e3f', marginTop: 2 }}>
                ♪ {np.song} <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', marginLeft: 8 }}>{np.artist}</span>
              </div>
            )}
          </div>

          {/* Transport */}
          <SketchCircle size={56} color="#2c5e3f" filled={r.playing} fillColor="#2c5e3f" onClick={() => r.togglePlay()}>
            {r.playing
              ? <svg width="18" height="18" viewBox="0 0 18 18"><rect x="3" y="2" width="4" height="14" fill="currentColor"/><rect x="11" y="2" width="4" height="14" fill="currentColor"/></svg>
              : <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 2 L16 9 L3 16 Z" fill="currentColor"/></svg>}
          </SketchCircle>

          {/* Vol + sleep */}
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a' }}>VOL</span>
              <input type="range" min="0" max="1" step="0.01" value={r.volume}
                onChange={(e) => r.setVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#2c5e3f' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a' }}>SLP</span>
              {[0, 15, 30, 60].map((m) => (
                <button key={m} onClick={() => r.setSleepMin(m)}
                  style={{ fontFamily: '"Courier New", monospace', fontSize: 9, padding: '2px 6px',
                    border: `1px ${r.sleepMin === m ? 'solid' : 'dashed'} #1a3a5c`,
                    background: r.sleepMin === m ? '#1a3a5c' : 'transparent',
                    color: r.sleepMin === m ? '#fdfbf5' : '#1a3a5c', cursor: 'pointer' }}>
                  {m === 0 ? 'off' : m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SketchBox>
    </div>
  );
}

Object.assign(window, { VariationB });
