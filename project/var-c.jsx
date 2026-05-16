// Variation C — Genre-grouped list with big now-playing hero.
// Stations grouped by genre on the left; right side dominated by a large
// now-playing card with thumbnail and full transport.

function VariationC({ mountainOpacity = 0.18 }) {
  const r = useRadio();
  const np = r.current ? getNowPlaying(r.current.id) : null;
  const W = 1100, H = 720;

  const groups = {};
  STATIONS.forEach((s) => {
    const g = s.genre.split(' / ')[0];
    if (!groups[g]) groups[g] = [];
    groups[g].push(s);
  });

  return (
    <div style={{ width: W, height: H, position: 'relative', background: '#fdfbf5', overflow: 'hidden', fontFamily: '"Caveat", "Comic Sans MS", cursive' }}>
      <MountRainier opacity={mountainOpacity} />

      <div style={{ position: 'absolute', top: 24, left: 36, right: 36, zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#1a3a5c', letterSpacing: '-0.5px' }}>Salish Sound</div>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a' }}>// GROUPED · HERO PLAYER · v3</div>
        </div>
        <Scribble width={120} color="#2c5e3f" />
      </div>

      {/* Left column: grouped list */}
      <div style={{ position: 'absolute', top: 100, left: 36, width: 360, bottom: 36, overflowY: 'auto', paddingRight: 8 }}>
        {Object.entries(groups).map(([g, list]) => (
          <div key={g} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {g}
              </div>
              <div style={{ flex: 1, height: 1, borderTop: '1px dashed rgba(168,80,30,0.4)' }} />
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a' }}>{list.length}</div>
            </div>
            {list.map((s) => {
              const active = r.currentId === s.id;
              const fav = r.favorites.includes(s.id);
              return (
                <div key={s.id} onClick={() => r.togglePlay(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', cursor: 'pointer',
                    background: active ? 'rgba(44,94,63,0.14)' : 'transparent',
                    borderLeft: `3px ${active ? 'solid' : 'dashed'} ${active ? '#2c5e3f' : 'rgba(26,58,92,0.3)'}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, color: '#1a3a5c', lineHeight: 1 }}>{s.name}</div>
                    <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, color: '#6b5d4a', marginTop: 2 }}>{s.freq}</div>
                  </div>
                  {active && r.playing && (
                    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
                      <div style={{ width: 2, background: '#2c5e3f', height: '60%', animation: 'eq 0.8s ease-in-out infinite alternate' }} />
                      <div style={{ width: 2, background: '#2c5e3f', height: '100%', animation: 'eq 0.6s ease-in-out infinite alternate' }} />
                      <div style={{ width: 2, background: '#2c5e3f', height: '40%', animation: 'eq 0.7s ease-in-out infinite alternate' }} />
                    </div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); r.toggleFavorite(s.id); }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: fav ? '#a8501e' : 'rgba(26,58,92,0.4)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M12 2 L14.5 8.5 L21.5 9 L16 13.5 L18 21 L12 17 L6 21 L8 13.5 L2.5 9 L9.5 8.5 Z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
        <style>{`@keyframes eq { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
      </div>

      {/* Right: hero player */}
      <SketchBox style={{ position: 'absolute', top: 100, left: 420, right: 36, bottom: 36, padding: 32, background: 'rgba(253,251,245,0.85)' }} color="#1a3a5c">
        <div style={{ display: 'flex', gap: 28, height: '100%' }}>
          <div style={{ width: 280, display: 'flex', flexDirection: 'column' }}>
            <SketchBox style={{ width: 280, height: 280, background: 'repeating-linear-gradient(135deg, rgba(26,58,92,0.08) 0 10px, transparent 10px 20px)' }} color="#1a3a5c" dashed>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#1a3a5c" strokeWidth="1.8">
                  <circle cx="40" cy="40" r="36" />
                  <circle cx="40" cy="40" r="28" strokeDasharray="2 3" opacity="0.6" />
                  <circle cx="40" cy="40" r="18" strokeDasharray="2 3" opacity="0.4" />
                  <circle cx="40" cy="40" r="5" fill="#1a3a5c" />
                </svg>
                <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, color: '#6b5d4a' }}>
                  [ thumbnail / artwork ]
                </div>
                <div style={{ fontFamily: '"Courier New", monospace', fontSize: 8, color: '#a8501e' }}>
                  ← from stream metadata
                </div>
              </div>
            </SketchBox>
            <div style={{ marginTop: 12, fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', textAlign: 'center' }}>
              {r.buffering ? '◌ buffering…' : r.playing ? '● ON AIR' : '○ paused'}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#a8501e', letterSpacing: '1px' }}>NOW PLAYING</div>
            <div style={{ fontSize: 42, color: '#1a3a5c', lineHeight: 1, marginTop: 4 }}>
              {r.current ? r.current.name : 'Choose a station →'}
            </div>
            {r.current && (
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: '#6b5d4a', marginTop: 4 }}>
                {r.current.freq} · {r.current.genre} · {r.current.tag}
              </div>
            )}
            {np && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px dashed rgba(26,58,92,0.3)' }}>
                <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a' }}>track</div>
                <div style={{ fontSize: 26, color: '#2c5e3f', lineHeight: 1.1, marginTop: 2 }}>♪ {np.song}</div>
                <div style={{ fontSize: 18, color: '#1a3a5c', marginTop: 2 }}>{np.artist}</div>
              </div>
            )}

            <div style={{ flex: 1 }} />

            {/* Transport */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <SketchCircle size={40} color="#1a3a5c" onClick={() => {
                const i = STATIONS.findIndex((s) => s.id === r.currentId);
                r.play(STATIONS[(i - 1 + STATIONS.length) % STATIONS.length].id);
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14"><path d="M3 1 v12 M11 1 L4 7 L11 13 Z" fill="currentColor" stroke="currentColor"/></svg>
              </SketchCircle>
              <SketchCircle size={64} color="#2c5e3f" filled={r.playing} fillColor="#2c5e3f" onClick={() => r.togglePlay()}>
                {r.playing
                  ? <svg width="20" height="20" viewBox="0 0 20 20"><rect x="3" y="2" width="5" height="16" fill="currentColor"/><rect x="12" y="2" width="5" height="16" fill="currentColor"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 2 L18 10 L3 18 Z" fill="currentColor"/></svg>}
              </SketchCircle>
              <SketchCircle size={40} color="#1a3a5c" onClick={() => {
                const i = STATIONS.findIndex((s) => s.id === r.currentId);
                r.play(STATIONS[(i + 1) % STATIONS.length].id);
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14"><path d="M11 1 v12 M3 1 L10 7 L3 13 Z" fill="currentColor" stroke="currentColor"/></svg>
              </SketchCircle>
              <div style={{ flex: 1 }} />
              <button onClick={() => r.current && r.toggleFavorite(r.current.id)}
                style={{ border: '1px dashed #a8501e', background: r.current && r.favorites.includes(r.current.id) ? '#a8501e' : 'transparent',
                  padding: '8px 12px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: 10,
                  color: r.current && r.favorites.includes(r.current.id) ? '#fdfbf5' : '#a8501e' }}>
                ★ favorite
              </button>
            </div>

            {/* Vol */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 40 }}>VOL</span>
              <input type="range" min="0" max="1" step="0.01" value={r.volume}
                onChange={(e) => r.setVolume(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#2c5e3f' }} />
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6b5d4a', width: 30 }}>{Math.round(r.volume*100)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          </div>
        </div>
      </SketchBox>
    </div>
  );
}

Object.assign(window, { VariationC });
