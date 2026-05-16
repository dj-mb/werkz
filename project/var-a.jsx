// Variation A — Classic split: scrollable list left, big player right.
// The most expected layout. Wireframe vibe with hand-drawn boxes.

function VariationA({ mountainOpacity = 0.18 }) {
  const r = useRadio();
  const np = r.current ? getNowPlaying(r.current.id) : null;
  const W = 1100, H = 720;

  return (
    <div style={{ width: W, height: H, position: 'relative', background: '#fdfbf5', overflow: 'hidden', fontFamily: '"Caveat", "Comic Sans MS", cursive' }}>
      <MountRainier opacity={mountainOpacity} />

      {/* Header */}
      <div style={{ position: 'absolute', top: 24, left: 36, right: 36, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', zIndex: 2 }}>
        <div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#1a3a5c', lineHeight: 1, letterSpacing: '-0.5px' }}>
            Salish Sound
          </div>
          <div style={{ marginTop: 2 }}>
            <Scribble width={140} color="#2c5e3f" />
          </div>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a', marginTop: 6, letterSpacing: '0.5px' }}>
            // PNW STREAMING RADIO · WIREFRAME v1
          </div>
        </div>
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a' }}>
          weather: 52°F · drizzle
        </div>
      </div>

      {/* Left: station list */}
      <SketchBox style={{ position: 'absolute', top: 110, left: 36, width: 460, height: 580, padding: 20, background: 'rgba(253,251,245,0.85)' }} color="#1a3a5c">
        <div style={{ fontSize: 22, color: '#1a3a5c', marginBottom: 4 }}>Stations</div>
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', marginBottom: 14 }}>
          [ {STATIONS.length} available · scroll for more ]
        </div>
        <div style={{ height: 480, overflowY: 'auto', paddingRight: 8 }}>
          {STATIONS.map((s) => {
            const active = r.currentId === s.id;
            const fav = r.favorites.includes(s.id);
            return (
              <div key={s.id} onClick={() => r.togglePlay(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px',
                  borderBottom: '1px dashed rgba(26,58,92,0.25)', cursor: 'pointer',
                  background: active ? 'rgba(44,94,63,0.12)' : 'transparent',
                }}>
                <SketchCircle size={36} color="#1a3a5c" filled={active && r.playing} fillColor="#2c5e3f">
                  {active && r.playing
                    ? <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1" width="3" height="10" fill="currentColor"/><rect x="7" y="1" width="3" height="10" fill="currentColor"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 1 L11 6 L2 11 Z" fill="currentColor"/></svg>}
                </SketchCircle>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 22, color: '#1a3a5c', lineHeight: 1 }}>{s.name}</div>
                  <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', marginTop: 4 }}>
                    {s.freq} · {s.genre}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); r.toggleFavorite(s.id); }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: fav ? '#a8501e' : '#1a3a5c' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <path d="M12 2 L14.5 8.5 L21.5 9 L16 13.5 L18 21 L12 17 L6 21 L8 13.5 L2.5 9 L9.5 8.5 Z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </SketchBox>

      {/* Right: player */}
      <SketchBox style={{ position: 'absolute', top: 110, left: 520, width: 540, height: 580, padding: 28, background: 'rgba(253,251,245,0.85)' }} color="#2c5e3f">
        <div style={{ fontSize: 22, color: '#2c5e3f', marginBottom: 4 }}>Now Playing</div>
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', marginBottom: 18 }}>
          [ media player · basic controls ]
        </div>

        {/* Thumbnail placeholder */}
        <div style={{ position: 'relative', width: 240, height: 240, margin: '0 auto 18px' }}>
          <SketchBox style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, rgba(26,58,92,0.06) 0 8px, transparent 8px 16px)' }} color="#1a3a5c" dashed>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#1a3a5c" strokeWidth="1.8">
                <circle cx="30" cy="30" r="26" />
                <circle cx="30" cy="30" r="20" strokeDasharray="2 3" opacity="0.5" />
                <circle cx="30" cy="30" r="4" fill="#1a3a5c" />
              </svg>
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, color: '#6b5d4a', textAlign: 'center', padding: '0 12px' }}>
                {r.current ? '[stream artwork →]' : '[ select a station ]'}
              </div>
            </div>
          </SketchBox>
          {r.buffering && (
            <div style={{ position: 'absolute', top: -6, right: -6, background: '#a8501e', color: '#fdfbf5', fontFamily: '"Courier New", monospace', fontSize: 9, padding: '3px 8px', transform: 'rotate(4deg)' }}>
              buffering…
            </div>
          )}
        </div>

        {/* Now playing meta */}
        <div style={{ textAlign: 'center', marginBottom: 14, minHeight: 64 }}>
          <div style={{ fontSize: 28, color: '#1a3a5c', lineHeight: 1.1 }}>
            {r.current ? r.current.name : 'No station selected'}
          </div>
          {np && (
            <>
              <div style={{ fontSize: 18, color: '#2c5e3f', marginTop: 4 }}>♪ {np.song}</div>
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a', marginTop: 2 }}>{np.artist}</div>
            </>
          )}
        </div>

        {/* Transport */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 22 }}>
          <SketchCircle size={44} color="#1a3a5c" onClick={() => {
            const i = STATIONS.findIndex((s) => s.id === r.currentId);
            r.play(STATIONS[(i - 1 + STATIONS.length) % STATIONS.length].id);
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1 v12 M11 1 L4 7 L11 13 Z" fill="currentColor" stroke="currentColor" strokeWidth="1"/></svg>
          </SketchCircle>
          <SketchCircle size={68} color="#2c5e3f" filled={r.playing} fillColor="#2c5e3f"
            onClick={() => r.togglePlay()}>
            {r.playing
              ? <svg width="22" height="22" viewBox="0 0 22 22"><rect x="4" y="2" width="5" height="18" fill="currentColor"/><rect x="13" y="2" width="5" height="18" fill="currentColor"/></svg>
              : <svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 2 L20 11 L4 20 Z" fill="currentColor"/></svg>}
          </SketchCircle>
          <SketchCircle size={44} color="#1a3a5c" onClick={() => {
            const i = STATIONS.findIndex((s) => s.id === r.currentId);
            r.play(STATIONS[(i + 1) % STATIONS.length].id);
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M11 1 v12 M3 1 L10 7 L3 13 Z" fill="currentColor" stroke="currentColor" strokeWidth="1"/></svg>
          </SketchCircle>
        </div>

        {/* Volume + sleep */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 50 }}>VOL</span>
          <input type="range" min="0" max="1" step="0.01" value={r.volume}
            onChange={(e) => r.setVolume(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#2c5e3f' }} />
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 30, textAlign: 'right' }}>
            {Math.round(r.volume * 100)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 50 }}>SLEEP</span>
          {[0, 15, 30, 60].map((m) => (
            <button key={m} onClick={() => r.setSleepMin(m)}
              style={{
                fontFamily: '"Courier New", monospace', fontSize: 10, padding: '4px 10px',
                border: `1px ${r.sleepMin === m ? 'solid' : 'dashed'} #1a3a5c`,
                background: r.sleepMin === m ? '#1a3a5c' : 'transparent',
                color: r.sleepMin === m ? '#fdfbf5' : '#1a3a5c', cursor: 'pointer',
              }}>
              {m === 0 ? 'off' : `${m}m`}
            </button>
          ))}
          {r.sleepRemaining > 0 && (
            <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', marginLeft: 'auto' }}>
              -{fmtTime(r.sleepRemaining)}
            </span>
          )}
        </div>
      </SketchBox>
    </div>
  );
}

Object.assign(window, { VariationA });
