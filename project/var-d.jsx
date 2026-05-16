// Variation D — Tuner dial metaphor.
// Stations laid out along a horizontal frequency dial; rotating the dial
// (or clicking a station tick) tunes to it. Now-playing card sits below.

function VariationD({ mountainOpacity = 0.18 }) {
  const r = useRadio();
  const np = r.current ? getNowPlaying(r.current.id) : null;
  const W = 1100, H = 720;

  const idx = Math.max(0, STATIONS.findIndex((s) => s.id === r.currentId));
  const tickSpacing = (W - 120) / (STATIONS.length - 1);

  return (
    <div style={{ width: W, height: H, position: 'relative', background: '#fdfbf5', overflow: 'hidden', fontFamily: '"Caveat", "Comic Sans MS", cursive' }}>
      <MountRainier opacity={mountainOpacity} />

      <div style={{ position: 'absolute', top: 24, left: 36, right: 36, zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#1a3a5c', letterSpacing: '-0.5px' }}>Salish Sound</div>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a' }}>// TUNER DIAL · v4</div>
        </div>
        <Scribble width={140} color="#a8501e" />
      </div>

      {/* Tuner strip */}
      <SketchBox style={{ position: 'absolute', top: 110, left: 36, right: 36, height: 200, padding: 24, background: 'rgba(253,251,245,0.85)' }} color="#1a3a5c">
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', letterSpacing: '1px', marginBottom: 8 }}>
          ▼ FREQUENCY DIAL · click a tick to tune
        </div>

        <div style={{ position: 'relative', height: 110, marginTop: 14 }}>
          {/* Dial baseline */}
          <svg width="100%" height="100%" viewBox={`0 0 ${W - 120} 110`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <line x1="20" y1="55" x2={W - 140} y2="55" stroke="#1a3a5c" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Decorative minor ticks */}
            {Array.from({ length: 80 }).map((_, i) => {
              const x = 20 + (i * (W - 160)) / 79;
              const isMajor = i % 5 === 0;
              return <line key={i} x1={x} y1={55} x2={x} y2={isMajor ? 48 : 51} stroke="#6b5d4a" strokeWidth="0.8" opacity="0.5" />;
            })}
          </svg>

          {/* Indicator (red needle) */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 20 + idx * tickSpacing, width: 2, transition: 'left 0.3s ease' }}>
            <svg width="20" height="110" viewBox="0 0 20 110" style={{ position: 'absolute', left: -10, top: 0 }}>
              <path d="M 10 0 L 14 12 L 10 110 L 6 12 Z" fill="#a8501e" stroke="#a8501e" strokeWidth="0.5" />
              <circle cx="10" cy="55" r="3" fill="#fdfbf5" stroke="#a8501e" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Station ticks */}
          {STATIONS.map((s, i) => {
            const active = r.currentId === s.id;
            const fav = r.favorites.includes(s.id);
            return (
              <div key={s.id} onClick={() => r.togglePlay(s.id)}
                style={{ position: 'absolute', left: 20 + i * tickSpacing, top: 0, transform: 'translateX(-50%)',
                  height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: active ? 18 : 14, color: active ? '#1a3a5c' : '#6b5d4a', lineHeight: 1, fontWeight: active ? 700 : 400, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                  {s.name}
                </div>
                <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, color: active ? '#a8501e' : '#6b5d4a', marginTop: 2 }}>
                  {s.freq.replace(' FM', '').replace('Online', 'WEB')}
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%',
                  background: active ? '#2c5e3f' : 'transparent',
                  border: `1.5px solid ${fav ? '#a8501e' : '#1a3a5c'}` }} />
              </div>
            );
          })}
        </div>
      </SketchBox>

      {/* Now playing — left thumbnail, right meta+transport */}
      <SketchBox style={{ position: 'absolute', top: 330, left: 36, width: 460, height: 360, padding: 20, background: 'rgba(253,251,245,0.85)' }} color="#2c5e3f">
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', letterSpacing: '1px', marginBottom: 10 }}>
          ▼ THUMBNAIL · from stream
        </div>
        <SketchBox style={{ width: 280, height: 280, margin: '0 auto', background: 'repeating-linear-gradient(45deg, rgba(26,58,92,0.07) 0 8px, transparent 8px 16px)' }} color="#1a3a5c" dashed>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#1a3a5c" strokeWidth="1.8">
              <rect x="20" y="14" width="40" height="50" rx="2" />
              <rect x="14" y="20" width="40" height="50" rx="2" opacity="0.5" strokeDasharray="2 2" />
              <path d="M 30 32 v 18 a 4 4 0 1 1 -4 -4" />
              <circle cx="48" cy="32" r="3" fill="#1a3a5c" />
            </svg>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, color: '#6b5d4a', textAlign: 'center', padding: '0 12px' }}>
              [ artwork pulled from<br />stream metadata header ]
            </div>
            {r.buffering && (
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', marginTop: 4 }}>
                ◌ buffering…
              </div>
            )}
          </div>
        </SketchBox>
      </SketchBox>

      <SketchBox style={{ position: 'absolute', top: 330, left: 520, right: 36, height: 360, padding: 24, background: 'rgba(253,251,245,0.85)' }} color="#1a3a5c">
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', letterSpacing: '1px' }}>NOW PLAYING</div>
        <div style={{ fontSize: 44, color: '#1a3a5c', lineHeight: 1, marginTop: 4 }}>
          {r.current ? r.current.name : '— tune in —'}
        </div>
        {r.current && (
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a', marginTop: 6 }}>
            {r.current.freq} · {r.current.genre}
          </div>
        )}
        {np && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed rgba(26,58,92,0.3)' }}>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a' }}>track</div>
            <div style={{ fontSize: 26, color: '#2c5e3f', lineHeight: 1.1, marginTop: 2 }}>♪ {np.song}</div>
            <div style={{ fontSize: 18, color: '#1a3a5c', marginTop: 2 }}>{np.artist}</div>
          </div>
        )}

        {/* Transport row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
          <SketchCircle size={64} color="#2c5e3f" filled={r.playing} fillColor="#2c5e3f" onClick={() => r.togglePlay()}>
            {r.playing
              ? <svg width="20" height="20" viewBox="0 0 20 20"><rect x="3" y="2" width="5" height="16" fill="currentColor"/><rect x="12" y="2" width="5" height="16" fill="currentColor"/></svg>
              : <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 2 L18 10 L3 18 Z" fill="currentColor"/></svg>}
          </SketchCircle>
          <button onClick={() => r.current && r.toggleFavorite(r.current.id)}
            style={{ border: '1px dashed #a8501e', background: r.current && r.favorites.includes(r.current.id) ? '#a8501e' : 'transparent',
              padding: '10px 14px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: 11,
              color: r.current && r.favorites.includes(r.current.id) ? '#fdfbf5' : '#a8501e' }}>
            ★ {r.current && r.favorites.includes(r.current.id) ? 'favorited' : 'favorite'}
          </button>
        </div>

        {/* Vol + sleep stacked */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 40 }}>VOL</span>
          <input type="range" min="0" max="1" step="0.01" value={r.volume}
            onChange={(e) => r.setVolume(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#2c5e3f' }} />
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 30 }}>{Math.round(r.volume*100)}</span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 40 }}>SLEEP</span>
          {[0, 15, 30, 60].map((m) => (
            <button key={m} onClick={() => r.setSleepMin(m)}
              style={{ fontFamily: '"Courier New", monospace', fontSize: 10, padding: '3px 9px',
                border: `1px ${r.sleepMin === m ? 'solid' : 'dashed'} #1a3a5c`,
                background: r.sleepMin === m ? '#1a3a5c' : 'transparent',
                color: r.sleepMin === m ? '#fdfbf5' : '#1a3a5c', cursor: 'pointer' }}>
              {m === 0 ? 'off' : `${m}m`}
            </button>
          ))}
          {r.sleepRemaining > 0 && (
            <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', marginLeft: 'auto' }}>-{fmtTime(r.sleepRemaining)}</span>
          )}
        </div>
      </SketchBox>
    </div>
  );
}

Object.assign(window, { VariationD });
